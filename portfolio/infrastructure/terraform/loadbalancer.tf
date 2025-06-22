resource "google_compute_backend_bucket" "portfolio_storage" {

    name             = var.resource_names.storage_backend
    bucket_name      = google_storage_bucket.frontend.name
    enable_cdn       = true
    compression_mode = "AUTOMATIC"
    
    cdn_policy {
        cache_mode         = "CACHE_ALL_STATIC"
        request_coalescing = true
        default_ttl        = 3600   # 1 hour
        client_ttl         = 3600   # 1 hour
        max_ttl            = 86400  # 1 day
    }
}

resource "google_compute_url_map" "portfolio_router" {
    name = var.resource_names.url_map
    
    # When domain is configured: redirect HTTP to HTTPS
    # When no domain: serve content directly via HTTP
    default_service = local.is_domain_enabled ? null : google_compute_backend_bucket.portfolio_storage.id
    
    dynamic "default_url_redirect" {
        for_each = local.is_domain_enabled ? [1] : []
        content {
            https_redirect         = true
            redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
            strip_query            = false
        }
    }
}

# HTTPS URL map serves actual content (only when domain configured)
resource "google_compute_url_map" "portfolio_https_router" {
    for_each = local.is_domain_enabled ? { enabled = true } : {}
    
    name            = "${var.resource_names.url_map}-https"
    default_service = google_compute_backend_bucket.portfolio_storage.id
}

resource "google_compute_global_address" "portfolio_ip" {
    name         = var.resource_names.ip_address
    ip_version   = "IPV4"
    address_type = "EXTERNAL"
}

resource "google_compute_target_http_proxy" "portfolio_http_proxy" {
    name    = var.resource_names.http_proxy
    url_map = google_compute_url_map.portfolio_router.id
}

resource "google_compute_global_forwarding_rule" "portfolio_http_rule" {
    name                  = var.resource_names.forwarding_rule
    target                = google_compute_target_http_proxy.portfolio_http_proxy.id
    port_range            = "80"
    ip_address            = google_compute_global_address.portfolio_ip.address
    load_balancing_scheme = "EXTERNAL_MANAGED"
    ip_protocol           = "TCP"
}

resource "google_compute_managed_ssl_certificate" "portfolio_ssl" {
    for_each = local.is_domain_enabled ? { enabled = true } : {}
    
    name = var.resource_names.ssl_certificate
    
    managed {
        domains = local.ssl_domains
    }
    
    lifecycle {
        create_before_destroy = true
    }
}

resource "google_compute_target_https_proxy" "portfolio_https_proxy" {
    for_each = local.is_domain_enabled ? { enabled = true } : {}
    
    name             = var.resource_names.https_proxy
    url_map          = google_compute_url_map.portfolio_https_router[each.key].id
    ssl_certificates = [google_compute_managed_ssl_certificate.portfolio_ssl[each.key].id]
}

resource "google_compute_global_forwarding_rule" "portfolio_https_rule" {
    for_each = local.is_domain_enabled ? { enabled = true } : {}
    
    name                  = var.resource_names.https_forwarding_rule
    target                = google_compute_target_https_proxy.portfolio_https_proxy[each.key].id
    port_range            = "443"
    ip_address            = google_compute_global_address.portfolio_ip.address
    load_balancing_scheme = "EXTERNAL_MANAGED"
    ip_protocol           = "TCP"
}