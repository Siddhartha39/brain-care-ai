import os
import sys
import time
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

def train_brain_tumor_model(dataset_path, output_model_path):
    print("=" * 70)
    print("BrainCare AI — Deep Learning Model Training & Accuracy Evaluation")
    print("=" * 70)
    print(f"Dataset location: {dataset_path}")
    print(f"Output model target: {output_model_path}")

    IMG_SIZE = (224, 224)
    BATCH_SIZE = 32
    EPOCHS = 15

    # Locate dataset directories
    train_dir = None
    test_dir = None

    for root, dirs, files in os.walk(dataset_path):
        for d in dirs:
            low = d.lower()
            if "train" in low:
                train_dir = os.path.join(root, d)
            elif "test" in low:
                test_dir = os.path.join(root, d)

    if not train_dir:
        train_dir = dataset_path

    print(f"\n[1/5] Loading MRI Images from: {train_dir}")

    if test_dir and os.path.exists(test_dir):
        train_ds = tf.keras.utils.image_dataset_from_directory(
            train_dir,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='categorical',
            shuffle=True
        )
        val_ds = tf.keras.utils.image_dataset_from_directory(
            test_dir,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='categorical',
            shuffle=False
        )
    else:
        train_ds = tf.keras.utils.image_dataset_from_directory(
            train_dir,
            validation_split=0.2,
            subset="training",
            seed=42,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='categorical'
        )
        val_ds = tf.keras.utils.image_dataset_from_directory(
            train_dir,
            validation_split=0.2,
            subset="validation",
            seed=42,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='categorical'
        )

    class_names = train_ds.class_names
    print(f"Target Classification Classes ({len(class_names)}): {class_names}")

    # Normalization & Augmentation
    rescaling_layer = layers.Rescaling(1./255)
    augmentation_layer = models.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.15),
        layers.RandomZoom(0.1),
    ])

    train_ds = train_ds.map(lambda x, y: (augmentation_layer(x, training=True), y))
    train_ds = train_ds.map(lambda x, y: (rescaling_layer(x), y)).prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.map(lambda x, y: (rescaling_layer(x), y)).prefetch(tf.data.AUTOTUNE)

    print("\n[2/5] Building CNN Architecture with Conv2D + Grad-CAM Compatibility...")
    model = models.Sequential([
        tf.keras.Input(shape=(224, 224, 3)),
        
        layers.Conv2D(32, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        layers.Conv2D(64, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        layers.Conv2D(128, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        layers.Conv2D(256, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(len(class_names), activation='softmax')
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')]
    )

    print("\nModel Architecture Summary:")
    model.summary()

    callbacks = [
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, verbose=1, min_lr=1e-6),
        EarlyStopping(monitor='val_loss', patience=4, restore_best_weights=True, verbose=1)
    ]

    print("\n[3/5] Starting Model Training...")
    start_time = time.time()
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    elapsed_time = time.time() - start_time
    print(f"\nTraining completed in {elapsed_time:.2f} seconds.")

    print("\n[4/5] Evaluating Test/Validation Performance...")
    metrics = model.evaluate(val_ds, verbose=0)
    loss = metrics[0]
    accuracy = metrics[1]
    precision = metrics[2] if len(metrics) > 2 else 0.0
    recall = metrics[3] if len(metrics) > 3 else 0.0

    print("\n" + "=" * 70)
    print("MODEL ACCURACY & PERFORMANCE RESULTS")
    print("=" * 70)
    print(f"Overall Accuracy:  {accuracy * 100:.2f}%")
    print(f"Validation Loss:   {loss:.4f}")
    print(f"Precision Score:   {precision * 100:.2f}%")
    print(f"Recall Score:      {recall * 100:.2f}%")
    print("=" * 70)

    print(f"\n[5/5] Saving Trained Weights to: {output_model_path}")
    os.makedirs(os.path.dirname(output_model_path), exist_ok=True)
    model.save(output_model_path, include_optimizer=False)
    print("Model save completed successfully.")

    return accuracy, loss, precision, recall

if __name__ == '__main__':
    dataset_dir = sys.argv[1] if len(sys.argv) > 1 else "/Users/siddhartha/.cache/kagglehub/datasets/tombackert/brain-tumor-mri-data/versions/1"
    model_output = "/Users/siddhartha/Desktop/aad/projects/brain2/BrainCare/backend/model/brain_tumor_model.keras"
    train_brain_tumor_model(dataset_dir, model_output)
