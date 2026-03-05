                                Microservices Deployment on AWS using Terraform, Kubernetes & CI/CD

##  Project Overview

This project demonstrates end-to-end deployment of microservices on AWS 
using Infrastructure as Code (Terraform), container orchestration 
(Kubernetes), and an automated CI/CD pipeline.

The system is designed for scalability, high availability, and automated deployments.

# What This Project Demonstrates

- Infrastructure as Code using Terraform
- Container orchestration using Amazon Elastic Kubernetes Service
- CI/CD automation using Jenkins
- Scalable microservices architecture

Production-grade AWS networking   

##  Architecture

- AWS EKS for container orchestration
- Terraform for infrastructure provisioning
- Docker for containerization
- Jenkins for CI/CD
- Application Load Balancer for traffic routing


### Traffic Flow

1) User sends request via browser.
2) Application Load Balancer receives traffic.
3) ALB forwards traffic to Kubernetes Ingress Service.
4) Ingress Service routes traffic to appropriate Pod.
5) Pods communicate internally with other microservices.

### Infrastructure Layer (Provisioned via Terraform)

- VPC with public and private subnets
- Internet Gateway and Route Tables
- Security Groups
- EKS Cluster with Managed Node Groups
- IAM Roles and Policies


##  Infrastructure as Code (Terraform Modules)

Infrastructure is provisioned using Terraform with a modular architecture.

The following reusable modules are implemented:

- VPC Module
- Subnet Module
- EKS Cluster Module
- Node Group Module
- Security Group Module
- IAM Role Module

Each module is designed to be reusable and configurable using input variables.

### Why Terraform Modules?

- Improves code reusability
- Separates concerns
- Makes infrastructure scalable
- Easier maintenance
- Environment-based deployment (dev, staging, prod)


##  Kubernetes Configuration

- Deployment objects for each microservice
- Service objects for internal communication
- Rolling updates enabled
- Horizontal Pod Autoscaler (HPA) for scaling
- Liveness and Readiness Probes for self-healing

##  CI/CD Pipeline (Jenkins)

Pipeline Stages:

1. Code Checkout from GitHub
2. Install Dependancy
3. Build Docker Image
4. Push Image to Docker Hub
5. Update Kubernetes Deployment
6. Rollout new version using rolling update strategy

##  Scalability & High Availability

- Multiple replicas for each microservice
- Auto-scaling of worker nodes
- Load balanced traffic via ALB
- Self-healing pods managed by health Probes

##  Security

- IAM roles with least privilege access
- Private subnets for worker nodes
- Controlled inbound/outbound rules using Security Groups
- Secure Docker image access via credentials

 ## Network Architecture

The VPC is designed with high availability across two Availability Zones.

- 2 Public Subnets (for Load Balancer & NAT Gateway)
- 2 Private Subnets (for EKS Worker Nodes)
- Internet Gateway for public internet access
- NAT Gateway for outbound internet access from private subnets
- Route tables configured for proper traffic flow

# Network Flow
 Public Traffic Flow:
 User → ALB (Public Subnet) → Kubernetes Ingress → Pods

 Private Traffic Flow:
 Pods (Private Subnet) → NAT Gateway → Internet (for image pulls & updates)



