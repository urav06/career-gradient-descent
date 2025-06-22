terraform {

    required_version = "~> 1.12.2"

    required_providers {
        google = {
            version = "6.40.0"
            source = "hashicorp/google"
        }
    }

    backend "gcs" {
        bucket = "urav-portfolio-terraform-state"
        prefix = ""  # Store at the root of the bucket
    }
}

provider "google" {
    project = var.project_id
    region  = var.region
}