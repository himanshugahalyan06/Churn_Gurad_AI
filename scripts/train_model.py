"""
Train ChurnGuard Model
"""

from churnguard.models.train import train_model


def main():

    print("=" * 60)
    print("TRAINING CHURNGUARD MODEL")
    print("=" * 60)

    train_model()

    print("=" * 60)
    print("TRAINING COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    main()