pipeline {

    agent any 

    tools {
        nodejs "node22"
    }

    environment {
        DOCKER_USER="docdon0007"
        RIDE="ride-service"
        USER="user-service"
        CAPTAIN="captainservice"
        GATEWAY="gateway-service"
        
        RIDE_IMAGE="${DOCKER_USER}/${RIDE}:${env.BUILD_NUMBER}"
        USER_IMAGE="${DOCKER_USER}/${USER}:${env.BUILD_NUMBER}"
        CAPTAIN_IMAGE="${DOCKER_USER}/${CAPTAIN}:${env.BUILD_NUMBER}"
        GATEWAY_IMAGE="${DOCKER_USER}/${GATEWAY}:${ENV.BUILD_NUMBER}"

        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages{
        stage("check code"){
            steps{
                git branch: 'main',  url: 'https://github.com/Nikhil00-7/aws-microservices-deployment.git'
            }
        }

        stage("install Dependency"){
           steps{
            sh 'npm install'
           }
        }

        stage('run build'){
            steps{
                sh 'npm build'
            }
        }
        stage('run test'){
            steps{
                sh 'npm test'
            }
        }

        stage('Terraform init'){
            steps{
                dir ("Terraform"){
                sh 'terraform  init'
             }
            }
        }
        stage('Terraform plan'){
            steps{
                dir("Terraform"){
                sh 'terraform plan'
                }
            }
        }
    }
}