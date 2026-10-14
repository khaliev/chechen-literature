import { useTranslation } from '@/hooks/useTranslation';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__description">{t('footer_description')}</p>
        <p className="footer__copyright">{t('footer_copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
