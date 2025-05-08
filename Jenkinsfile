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
          sh "docker build -t $ECR_REPO:$IMAGE_TAG -f auth/Dockerfile auth"
        }
      }
    }

    stage('Login to ECR') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins-aws']]) {
          sh """
            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
          """
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        sh "docker push $ECR_REPO:$IMAGE_TAG"
      }
    }

    stage('Verify AWS Credentials') {
      steps {
        script {
          sh """
            aws sts get-caller-identity
          """
        }
      }
    }

    stage('Update Kubeconfig & Deploy to EKS') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins-aws']]) {
          sh """
            export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
            export AWS_DEFAULT_REGION=$AWS_REGION

            # Update Kubeconfig
            aws eks update-kubeconfig --region $AWS_REGION --name ticketing-cluster
            
            # Verify kubectl access to the cluster
            kubectl get svc
            
            # Deploy image
            kubectl set image deployment/auth-deployment auth=$ECR_REPO:$IMAGE_TAG
          """
        }
      }
    }
  }
}
