const express = require('express');

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(profileController.getAllProfiles)
  .post(profileController.createProfile)
  .delete(profileController.deleteUser);

router.get('/me', profileController.getMe);

router.get('/user/:user_id', profileController.getProfileById);

router.put('/experience', profileController.addExperience);
router.delete('/experience/:exp_id', profileController.deleteExperience);

router.put('/education', profileController.addEducation);
router.delete('/education/:edu_id', profileController.deleteEducation);

router.get('/github/:username', profileController.getUserRepos);

module.exports = router;
