import { useState } from 'react';
import { updateProfileInfo, updatePasswordInfo } from '../services/settingsService';

const emptyFeedback = () => ({ loading: false, success: null, error: null });

export const useSettings = () => {
  const [nameFeedback, setNameFeedback] = useState(emptyFeedback());
  const [emailFeedback, setEmailFeedback] = useState(emptyFeedback());
  const [passwordFeedback, setPasswordFeedback] = useState(emptyFeedback());

  const updateName = async (name) => {
    setNameFeedback({ loading: true, success: null, error: null });
    try {
      await updateProfileInfo({ name });
      setNameFeedback({ loading: false, success: 'Nom mis à jour avec succès.', error: null });
    } catch (err) {
      setNameFeedback({
        loading: false,
        success: null,
        error: err.response?.data?.message || 'Erreur lors de la mise à jour du nom.',
      });
      throw err;
    }
  };

  const updateEmail = async (email) => {
    setEmailFeedback({ loading: true, success: null, error: null });
    try {
      await updateProfileInfo({ email });
      setEmailFeedback({ loading: false, success: 'Email mis à jour avec succès.', error: null });
    } catch (err) {
      setEmailFeedback({
        loading: false,
        success: null,
        error: err.response?.data?.message || 'Erreur lors de la mise à jour de l\'email.',
      });
      throw err;
    }
  };

  const updatePassword = async (data) => {
    setPasswordFeedback({ loading: true, success: null, error: null });
    try {
      await updatePasswordInfo(data);
      setPasswordFeedback({ loading: false, success: 'Mot de passe mis à jour avec succès.', error: null });
    } catch (err) {
      setPasswordFeedback({
        loading: false,
        success: null,
        error: err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe.',
      });
      throw err;
    }
  };

  const clearNameFeedback = () => setNameFeedback(emptyFeedback());
  const clearEmailFeedback = () => setEmailFeedback(emptyFeedback());
  const clearPasswordFeedback = () => setPasswordFeedback(emptyFeedback());

  const setPasswordError = (message) =>
    setPasswordFeedback({ loading: false, success: null, error: message });

  return {
    updateName,
    updateEmail,
    updatePassword,
    nameFeedback,
    emailFeedback,
    passwordFeedback,
    clearNameFeedback,
    clearEmailFeedback,
    clearPasswordFeedback,
    setPasswordError,
  };
};
