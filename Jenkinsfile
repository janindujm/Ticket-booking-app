pipeline {
  agent any

  environment {
    AWS_REGION = "us-east-1"
    ECR_REPO = "010526250202.dkr.ecr.us-east-1.amazonaws.com/auth"
    IMAGE_TAG = "latest"
  }

  stages {

    stage('Checkout Code') {
      steps {
        git url: 'https://github.com/janindujm/Ticket-booking-app.git', branch: 'main'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t $ECR_REPO:$IMAGE_TAG ."
        }
      }
    }

    stage('Login to ECR') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins']]) {
          sh "aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO"
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        sh "docker push $ECR_REPO:$IMAGE_TAG"
      }
    }

    stage('Update Kubeconfig') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins']]) {
          sh "aws eks update-kubeconfig --region $AWS_REGION --name ticketing-cluster"
        }
      }
    }

    stage('Deploy to EKS') {
      steps {
        sh "kubectl set image deployment/auth-deployment auth=$ECR_REPO:$IMAGE_TAG"
      }
    }
  }
}
