pipeline {
    agent any 

    tools {
        nodejs "node22"
    }

    environment {
        DOCKER_USER = "docdon0007"
        TAG = "03"
        
        USER_IMAGE = "${DOCKER_USER}/user:${TAG}"
        RIDER_IMAGE = "${DOCKER_USER}/rider:${TAG}"
        CAPTAIN_IMAGE = "${DOCKER_USER}/captain:${TAG}"
        GATEWAY_IMAGE = "${DOCKER_USER}/apigateway:${TAG}"

        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {

        stage("Checkout Code") {
            steps {
                git branch: 'main', url: 'https://github.com/Nikhil00-7/uber.git'
            }
        }

        stage("Install Dependencies") {
            steps {
                sh '''
                    npm -v
                    node -v
                    npm install
                '''
            }
        }

        stage("Docker Login & Push") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-login',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USERNAME --password-stdin

                        docker build -t $USER_IMAGE ./micro-services/user
                        docker build -t $RIDER_IMAGE ./micro-services/ride
                        docker build -t $CAPTAIN_IMAGE ./micro-services/captain
                        docker build -t $GATEWAY_IMAGE ./micro-services/gateway

                        docker push $USER_IMAGE
                        docker push $RIDER_IMAGE
                        docker push $CAPTAIN_IMAGE
                        docker push $GATEWAY_IMAGE
                    '''
                }
            }
        }
   
        stage("Push Kubernetes YAMLs") {
            steps {
                sshagent(['k8s-master-ssh']) {
                    sh '''
                        scp -r micro-services/k8s ubuntu@192.168.2.20:/home/ubuntu/
                    '''
                }
            }
        }
        //      deploying on  local VMs
        stage("Deploy to Kubernetes") {
            steps {
                sshagent(['k8s-master-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@192.168.2.20 "
                            kubectl get ns uber || kubectl create ns uber
                            kubectl apply -f /home/ubuntu/k8s --recursive -n uber
                        "
                    '''
                }
            }
        }

       //  deploying  on aws  eks
       stage("Configure EKS Access"){
          steps{
           withCredentials([
            string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
            string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]){
              sh '''
                export AWS_DEFAULT_REGION=us-east-1

                aws sts get-caller-identity

                aws eks --region us-east-1 update-kubeconfig --name uber-eks-cluster

                kubectl get nodes
            '''
           }
         }
       }
    
    stage("Deploy to EKS") {
        steps {
         sh '''
            kubectl get ns uber || kubectl create ns uber
            kubectl apply -f micro-services/k8s --recursive -n uber
            kubectl get pods -n uber
        '''
    }
}

    }  

    post {
        success {
            echo "Deployment finished successfully!"
        }
        failure {
            echo "Deployment failed."
        }
    }

}  
