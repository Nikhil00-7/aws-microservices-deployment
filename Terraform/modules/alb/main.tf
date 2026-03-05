resource "helm_release" "aws_lb_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"

  set = [
    {
      name  = "clusterName"
      value = var.eks_cluster_name
    },
    {
      name  = "region"
      value = var.aws_region
    },
  
    {
      name  = "serviceAccount.create"
      value = "false"  
    }
  ]
}


resource "helm_release" "external_dns" {

   depends_on = []

  name       = "external-dns"
  repository = "https://kubernetes-sigs.github.io/external-dns/"
  chart      = "external-dns"

  namespace  = "kube-system"

  set = [
    {
      name  = "provider"
      value = "aws"
    },

    {
      name  = "serviceAccount.create"
      value = "false"
    },

    {
      name  = "serviceAccount.name"
      value = "external-dns"
    },

    {
      name  = "domainFilters[0]"
      value = "example.com"
    }
  ]
}