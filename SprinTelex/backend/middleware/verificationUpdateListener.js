Uconst VerificationRequest = require('../models/VerificationRequest');
const User = require('../models/userModel');

VerificationRequest.watch().on('change', async (change) => {
  console.log('Change detected in VerificationRequest:', change);
  if (change.operationType === 'update' || change.operationType === 'replace') {
    const requestId = change.documentKey._id;
    const updatedFields = change.updateDescription.updatedFields;

    if (updatedFields.status === 'approved') {
      const verificationRequest = await VerificationRequest.findById(requestId).populate('userId');

      if (verificationRequest && verificationRequest.userId) {
        await User.findByIdAndUpdate(verificationRequest.userId, { isVerified: true })
          .then(() => console.log(`User ${verificationRequest.userId} verified successfully`))
          .catch((error) => {
            console.error('Error updating user verification status:', error.message, error.stack);
          });
      } else {
        console.log(`No user found for verification request ${requestId}`);
      }
    }
  }
}).on('error', (error) => {
  console.error('Error watching VerificationRequest changes:', error.message, error.stack);
});