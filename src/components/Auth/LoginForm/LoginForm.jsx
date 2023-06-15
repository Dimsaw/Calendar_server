import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CgLogIn } from 'react-icons/cg';
import { AiOutlineLeftCircle } from 'react-icons/ai';

import {
  HeadingWrapper,
  StyledForm,
  StyledHeading,
  StyledHomeBtn,
} from './LoginForm.styled';
import { AuthField } from '../AuthField/AuthField';
import { logIn } from 'redux/auth/operations';
import { loginSchema, notification, useNotification } from 'helpers';
import { MainBtn } from 'utils/Buttons/MainButton.styled';
import { ForgotPasswordLink } from './ForgotPassword/ForgotPasswordLink';

export const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const toast = useNotification();

  const onSubmitForm = async (values, { resetForm }) => {
    try {
      const { payload } = await dispatch(logIn(values));
      if (
        payload === 'Request failed with status code 400' ||
        payload === 'Request failed with status code 401'
      ) {
        notification(toast, 'fail', t(`notifications.Incorrect`));
        return;
      } else if (payload === 'Request failed with status code 403') {
        notification(toast, 'fail', t(`notifications.Verify`));
        return;
      } else if (payload === 'Request failed with status code 404') {
        notification(toast, 'fail', t(`notifications.User not found`));
        return;
      }
      resetForm();
    } catch (err) {
      console.log('Error', err);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={loginSchema(
        t(`validation.Email must have @ and be valid`),
        t(`validation.Email is a required field`),
        t(`validation.Password is a required field`)
      )}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onSubmitForm}
    >
      {({ values, handleSubmit, handleBlur, handleChange }) => (
        <StyledForm onSubmit={handleSubmit}>
          <HeadingWrapper>
            <StyledHeading>{t(`sign.Log In`)}</StyledHeading>
            <StyledHomeBtn to="/">
              {t(`sign.Home`)}
              <AiOutlineLeftCircle
                style={{
                  marginLeft: 6,
                }}
              />
            </StyledHomeBtn>
          </HeadingWrapper>
          <AuthField
            name={'Email'}
            lableName={t(`sign.Email`)}
            value={values.email}
            type={'email'}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t(`sign.Enter email`)}
          />
          <AuthField
            name={'Password'}
            lableName={t(`sign.Password`)}
            value={values.password}
            type={'password'}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t(`sign.Enter password`)}
          />
          <MainBtn style={{ width: '100%', marginTop: '32px' }} type="submit">
            {t(`sign.Log In`)}
            <CgLogIn style={{ marginLeft: 11, width: 18, height: 18 }} />
          </MainBtn>
          <ForgotPasswordLink />
        </StyledForm>
      )}
    </Formik>
  );
};
