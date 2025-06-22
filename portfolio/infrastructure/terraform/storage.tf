resource "google_storage_bucket" "frontend" {

    name     = var.resource_names.frontend_bucket
    location = var.region

    website {
        main_page_suffix = "index.html"
        not_found_page   = "404.html"
    }

    # Required for load balancer backend bucket integration
    public_access_prevention = "inherited"
    uniform_bucket_level_access = true

    # Allows terraform destroy to delete bucket with contents
    force_destroy = true
}

resource "google_storage_bucket_iam_member" "public_read" {
    bucket = google_storage_bucket.frontend.name
    role   = "roles/storage.objectViewer"
    member = "allUsers"
}