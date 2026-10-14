import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { buildPageTitle, setPageTitle } from '@/utils/pageMeta';
import Button from '@/components/ui/Button';
import './NotFound.css';

export default function NotFound() {
  const { t } = useTranslation();

  useEffect(() => {
    setPageTitle(buildPageTitle([t('page_not_found')], t('site_title')));
  }, [t]);

  return (
    <div className="not-found">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">{t('page_not_found')}</h1>
      <Link to="/">
        <Button variant="primary">{t('go_home')}</Button>
      </Link>
    </div>
  );
}
