import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
        <div className={styles.footerInfo}>
          <div className={styles.footerContact}>
            <h3>Contato</h3>
            <p>Endereço da Empresa</p>
            <p>Telefone de Contato</p>
            <p>Email de Suporte</p>
          </div>
          <div className={styles.footerLinks}>
            <h3>Links Úteis</h3>
            <ul>
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Serviços</a></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Termos de Serviço</a></li>
            </ul>
          </div>
          <div className={styles.footerSocial}>
            <h3>Redes Sociais</h3>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          <p>&copy; 2024. Todos os direitos reservados.</p>
        </div>
      </footer>
    );
  }
  
  export default Footer;
