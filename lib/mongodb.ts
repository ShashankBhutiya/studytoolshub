// Mock MongoDB connection for file-based storage
async function dbConnect() {
  // No actual connection needed for file-based storage
  return Promise.resolve(true)
}

export default dbConnect
