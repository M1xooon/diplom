import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../GlobalState/state';
import './StartPage.css';
import img from './StartPage.svg';

function StartPage() {
  const navigate = useNavigate();
  const { sessionId } = useContext(Context);

  const onClickHandler = () => {
    navigate('/sign-up/');
  };

  useEffect(() => {
    if (sessionId) {
      navigate('/my-storage/');
    }
  }, [sessionId]);

  return (
    !sessionId
      ? (
        <section className="start-page">
          <div className="start-page--welcome">
            <h1 className="start-page--welcome--title">Загружайте, скачивайте и управляйте своими файлами.</h1>
            <h2 className="start-page--welcome--subtitle">Попробуйте новое хранилище файлов.</h2>
            <div className="start-page--welcome--content">
            bookingCloud - это новое простое хранилище файлов.
            Здесь вы можете хранить и управлять своими файлами. Попробуйте прямо сейчас!
            </div>
            <button className="sing-up-button" onClick={onClickHandler} type="button">Начать</button>
          </div>
          <img className="start-page--image" src={img} alt="StartPage" />
        </section>
      )
      : null
  );
}

export default StartPage;
