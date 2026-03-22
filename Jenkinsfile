pipeline {

    agent any 

    tools {
        nodejs "node22"
    }

    environment {
     PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages{
        stage("check code"){
            steps{
                git branch: 'main',  url: 'https://github.com/Nikhil00-7/aws-microservices-deployment.git'
            }
        }
    }
   
   stage ("Install Dependencies"){
     steps{
          script{
              def services = ['user' , 'ride' , 'captain', 'gateway']
              for (service in  services){
                  dir (service){
                  sh 'npm install'
                  }
              }
          }
     }
   }

   stage("Build Services"){
      steps{
        script{
              def services = ['user', 'ride' , 'captain', 'gateway']
                for (service in services){
                    dir(service){
                     sh 'npm build'
                    }
                }
        }
      }
   }

   stage("Run Tests"){
    steps{
        script{
             def services = ['user', 'ride' , 'captain', 'gateway']
                for (service in services){
                    dir(service){
                     sh 'npm test'
                    }
                }
        }
      }
   }
  
  stage("Create Artifact"){
    steps{
        script{
             def services = ['user', 'ride' , 'captain', 'gateway']
                for (service in services){
                    dir(service){
                      sh "zip -r ${service}.zip ."
                    }
                }
        }
    }
  }

  stage("Archive Artifact"){
    steps{
           archiveArtifacts artifacts: '**/*.zip', fingerprint: true
    }
  }
   
 stage("Build Docker Image"){
    steps{
        script {
             def services = ['user', 'ride' , 'captain', 'gateway']
                for (service in services){
                    dir(service){
                     sh "docker build -t docdon0007/${service}:${env.BUILD_NUMBER} ."
                    }
                }
        }
    }
 }

   stage("Push Docker Image"){
    steps{
        script{
           withCredentails([usernamePassword(credentialsId: "" , usernameVariable: "USER" , userpasswordVariable: "PASS")]){
             sh "docker login -u $USER -p $PASS"

              def services = ['user', 'ride' , 'captain', 'gateway']
                for (service in services){
                    dir(service){
                     sh "docker push  docdon0007/${service}:${env.BUILD_NUMBER}"
                    }
                }
           }
        }
      }
   }

 
}
