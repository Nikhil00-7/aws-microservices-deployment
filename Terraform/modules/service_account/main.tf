resource "kubernetes_service_account_v1" "alb_service_account" {
   metadata {
    name      = "aws-load-balancer-controller"
    namespace = "kube-system"

    annotations = {
      "eks.amazonaws.com/role-arn" = var.alb_role_arn
    }
  }
}




resource "kubernetes_service_account_v1" "external_dns_service_account" {
  metadata {
    name= "aws-external-dns-controller"
    namespace = "kube-sytem"
  
    annotations = {
      "eks.amazonaws.com/role-arn" = var.external_dns_role_arn
    }
  }
}
