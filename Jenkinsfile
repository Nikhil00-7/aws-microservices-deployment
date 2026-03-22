pipeline {

    agent any 

    tools {
        nodejs "node22"
    }

    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {

        stage("Checkout Code") {
            steps {
                git branch: 'main', url: 'https://github.com/Nikhil00-7/aws-microservices-deployment.git'
            }
        }

        stage("Install Dependencies") {
            steps {
                script {
                    def services = ['user', 'ride', 'captain', 'gateway']
                    for (service in services) {
                        dir(service) {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage("Build Services") {
            steps {
                script {
                    def services = ['user', 'ride', 'captain', 'gateway']
                    for (service in services) {
                        dir(service) {
                            sh 'npm run build || echo "No build script"'
                        }
                    }
                }
            }
        }

        stage("Run Tests") {
            steps {
                script {
                    def services = ['user', 'ride', 'captain']
                    for (service in services) {
                        dir(service) {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage("Create Artifact") {
            steps {
                script {
                    def services = ['user', 'ride', 'captain', 'gateway']
                    for (service in services) {
                        dir(service) {
                            sh "zip -r ${service}.zip ."
                        }
                    }
                }
            }
        }

        stage("Archive Artifact") {
            steps {
                archiveArtifacts artifacts: '**/*.zip', fingerprint: true
            }
        }

        stage("Build Docker Image") {
            steps {
                script {
                    def services = ['user', 'ride', 'captain', 'gateway']
                    for (service in services) {
                        dir(service) {
                            sh "docker build -t docdon0007/${service}:${env.BUILD_NUMBER} ."
                        }
                    }
                }
            }
        }

        stage("Push Docker Image") {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "docker-cred",
                        usernameVariable: "USER",
                        passwordVariable: "PASS"
                    )]) {

                        sh "docker login -u $USER -p $PASS"

                        def services = ['user', 'ride', 'captain', 'gateway']
                        for (service in services) {
                            sh "docker push docdon0007/${service}:${env.BUILD_NUMBER}"
                        }
                    }
                }
            }
        }

    }
}