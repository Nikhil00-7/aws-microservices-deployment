output "alb_service_account" {
   value = kubernetes_service_account_v1.alb_service_account.metadata[0].name
}

output "external_dns_service_account"{
  value = kubernetes_service_account_v1.external_dns_service_account.metadata[0].name 
}