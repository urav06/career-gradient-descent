resource "google_dns_managed_zone" "portfolio_zone" {
	for_each = local.is_domain_enabled ? { (var.domain_name) = var.dns_zone_name } : {}
	
	name        = each.value
	dns_name    = local.dns_name
	description = "DNS zone for domain: ${each.key}"
	
	dnssec_config {
		state = "on"
	}
	
	lifecycle {
		prevent_destroy = true
	}
}

resource "google_dns_record_set" "portfolio_root" {
	for_each = local.is_domain_enabled ? { (var.domain_name) = var.dns_zone_name } : {}
	
	name         = local.dns_name
	managed_zone = google_dns_managed_zone.portfolio_zone[each.key].name
	type         = "A"
	ttl          = 300
	rrdatas      = [google_compute_global_address.portfolio_ip.address]
}

resource "google_dns_record_set" "portfolio_www" {
	for_each = local.is_domain_enabled ? { (var.domain_name) = var.dns_zone_name } : {}
	
	name         = local.www_domain
	managed_zone = google_dns_managed_zone.portfolio_zone[each.key].name
	type         = "CNAME"
	ttl          = 300
	rrdatas      = [local.dns_name]
}