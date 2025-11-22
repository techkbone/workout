import Lottie from 'lottie-react'

function LottieAnimation({ animationData }) {
  if (!animationData) {
    return null
  }
  return <Lottie animationData={animationData} />
}

export default LottieAnimation
