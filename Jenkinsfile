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
          // Building the Docker image
          sh "docker build -t $ECR_REPO:$IMAGE_TAG -f auth/Dockerfile auth"
        }
      }
    }

    stage('Login to ECR') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins-aws']]) {
          sh """
            # Login to ECR
            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
          """
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        // Pushing the Docker image to ECR
        sh "docker push $ECR_REPO:$IMAGE_TAG"
      }
    }

    stage('Verify AWS Credentials') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins-aws']]) {
          // Verify AWS credentials by calling sts get-caller-identity
          sh "aws sts get-caller-identity"
        }
      }
    }

    stage('Update Kubeconfig & Deploy to EKS') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins-aws']]) {
          sh """
            # Update Kubeconfig for EKS access
            aws eks update-kubeconfig --region $AWS_REGION --name ticketing-cluster

            # Verify kubectl access to EKS
            kubectl get svc

            # Deploy the new image to the cluster
            kubectl set image deployment/auth-deployment auth=$ECR_REPO:$IMAGE_TAG

            # Restart the deployment to apply changes
            kubectl rollout restart deployment/auth-deployment
          """
        }
      }
    }
  }
}
