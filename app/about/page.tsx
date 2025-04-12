export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8">About Our Handwritten Character Recognition System</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Our system uses advanced machine learning techniques to recognize handwritten characters with high accuracy.
          The process involves several steps:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">1. Image Preprocessing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We convert uploaded images to grayscale, apply thresholding to separate text from background,
              and remove noise for cleaner results.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">2. Feature Extraction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Using Histogram of Oriented Gradients (HOG), we extract key features that help identify
              unique characteristics of each character.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">3. Classification</h3>
            <p className="text-gray-600 dark:text-gray-300">
              The k-Nearest Neighbors (k-NN) algorithm compares extracted features with our trained dataset
              to determine the most likely character match.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">4. Result Generation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We provide the recognized characters along with confidence scores to indicate the reliability
              of each prediction.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Machine Learning</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>k-Nearest Neighbors (k-NN) for character classification</li>
              <li>Histogram of Oriented Gradients (HOG) for feature extraction</li>
              <li>OpenCV.js for image preprocessing</li>
            </ul>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Web Technologies</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Next.js for server-side rendering and API routes</li>
              <li>React for interactive UI components</li>
              <li>Tailwind CSS for responsive styling</li>
              <li>NeonDB for data storage</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Accuracy & Performance</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Our system achieves high accuracy through:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
          <li>Continuous model training with diverse handwriting samples</li>
          <li>Robust preprocessing to handle various image qualities</li>
          <li>Advanced feature extraction techniques</li>
          <li>Regular performance monitoring and optimization</li>
        </ul>
      </section>
    </div>
  );
}