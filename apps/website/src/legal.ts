import { githubUrl, SITE } from './config.ts';
import type { Lang } from './content.ts';
import { LIABILITY, liabilityPath } from './paths.ts';

// Legal notice and privacy policy. The operator's details and the paragraphs on hosting, email and
// rights follow those of textcolumn.com, the operator's other site; the parts on downloads, the
// checksum checker, the app and its building blocks are this site's own. Inline marks as in
// content.ts; a link to a path of this site ("/assets/…") becomes relative on each page.

export type LegalKind = 'imprint' | 'privacy';

export interface LegalSection {
  heading?: string;
  /** An anchor, for links to this section from other pages. */
  id?: string;
  paragraphs: string[];
}

export interface LegalDoc {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

const ADDRESS = 'Sebastian Scherhans\nNiederbrodhagen 11\n33613 Bielefeld';
const EMAIL = `[${SITE.email}](mailto:${SITE.email})`;
const PHONE = '[+49 (0)521-98918703](tel:+4952198918703)';
const VAT = 'DE343507170';
const GITHUB_PRIVACY = 'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement';
const MICROSOFT_PRIVACY = 'https://privacy.microsoft.com/privacystatement';
const GITHUB_ADDRESS = 'GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA';
const HOSTER = 'Mittwald CM Service GmbH & Co. KG, Königsberger Straße 4-6, 32339 Espelkamp';
const LICENSE = githubUrl('/blob/main/LICENSE');
const FONT_LICENSES = { newsreader: '/assets/fonts/newsreader-OFL.txt', hanken: '/assets/fonts/hanken-grotesk-OFL.txt' };
const TRADEMARKS =
  'Gmail, Outlook, Hotmail, Microsoft 365, iCloud, Yahoo, GMX, WEB.DE, freenet, T-Online, IONOS, STRATO, mittwald, Posteo, mailbox.org, macOS and Windows';

// The privacy policy in the other languages of the app: translations, the German one is binding.
const frPrivacy: LegalDoc = {
  title: 'Politique de confidentialité',
  description: 'Comment le site web et l’application IMAP Transfer traitent les données.',
  updated: 'Dernière mise à jour : octobre 2026',
  sections: [
    {
      paragraphs: ['Ceci est une traduction. Seule la [version allemande](/de/datenschutz/) fait foi juridiquement.'],
    },
    {
      paragraphs: [
        'En bref : ce site ne dépose aucun cookie, ne compte pas les visiteurs et ne charge rien depuis d’autres fournisseurs. L’application IMAP Transfer fonctionne sur votre ordinateur ; vos messages et vos identifiants de connexion y restent, et nous ne recevons d’elle aucune donnée.',
      ],
    },
    { heading: 'Responsable du traitement', paragraphs: [`${ADDRESS}\n${EMAIL}`] },
    {
      heading: 'Consultation du site web',
      paragraphs: [
        'Lorsque vous consultez le site, votre navigateur transmet au serveur de notre hébergeur des informations techniquement nécessaires : adresse IP, date et heure, fichier demandé et informations sur votre navigateur et votre système d’exploitation. Ces informations sont traitées uniquement pour fournir le site et en assurer la sécurité, et ne sont conservées que le temps nécessaire à cette fin. La base juridique est notre intérêt légitime à un fonctionnement sûr (article 6, paragraphe 1, point f) du RGPD).',
        `Notre hébergeur est ${HOSTER}, Allemagne. Nous avons conclu avec lui un contrat de sous-traitance conformément à l’article 28 du RGPD.`,
        'Tous les fichiers du site, y compris les polices, proviennent de ce serveur. Aucun contenu n’est chargé depuis d’autres fournisseurs et aucun cookie n’est déposé.',
      ],
    },
    {
      heading: 'Téléchargements',
      paragraphs: [
        'Les fichiers d’installation sont servis par le même serveur que ce site. Un téléchargement transmet les mêmes informations que la consultation d’une page, et ce qui précède s’applique. Aucun autre fournisseur n’intervient.',
      ],
    },
    {
      heading: 'Vérification d’un fichier',
      paragraphs: [
        'Lorsque vous déposez ou choisissez un fichier téléchargé dans la zone de vérification, votre navigateur calcule sa somme de contrôle sur votre appareil. Le fichier n’est transmis ni à nous ni à quiconque.',
      ],
    },
    {
      heading: 'L’application IMAP Transfer',
      paragraphs: [
        'IMAP Transfer fonctionne sur votre ordinateur. Messages, sauvegardes, identifiants de connexion et paramètres y restent ; les mots de passe et les connexions sont stockés chiffrés dans le trousseau de votre système. L’application se connecte aux serveurs de messagerie que vous indiquez.',
        `Si vous choisissez « Se connecter avec Microsoft », l’application ouvre la page de connexion de Microsoft dans votre navigateur. La [déclaration de confidentialité de Microsoft](${MICROSOFT_PRIVACY}) s’y applique.`,
        `Si vous l’autorisez au premier démarrage, l’application demande à GitHub (${GITHUB_ADDRESS}) à chaque démarrage s’il existe une version plus récente et, le cas échéant, la télécharge. Vous pouvez désactiver cette option à tout moment en bas de la barre latérale. La version du Microsoft Store ne contacte pas GitHub ; elle reçoit ses mises à jour par le Store. GitHub reçoit alors votre adresse IP et les informations techniques de la requête et les traite conformément à sa propre [déclaration de confidentialité](${GITHUB_PRIVACY}). La base juridique est notre intérêt légitime à vous fournir des corrections de bogues et des mises à jour de sécurité (article 6, paragraphe 1, point f) du RGPD).`,
        'Au-delà, l’application n’envoie rien : pas de statistiques d’utilisation, pas de rapports de plantage, pas de compte. Nous ne recevons aucune donnée de l’application.',
        `IMAP Transfer est fourni en l’état, et notre responsabilité en cas de perte de données est limitée. Les détails figurent dans les mentions légales, à la section [Responsabilité pour l’application](${liabilityPath('fr')}) (en anglais).`,
      ],
    },
    {
      heading: 'Contact par e-mail',
      paragraphs: [
        'Si vous nous écrivez un e-mail, nous traitons votre adresse et votre message afin de répondre à votre demande. La base juridique est notre intérêt légitime à y répondre (article 6, paragraphe 1, point f) du RGPD). Nous supprimons les données dès que votre demande est traitée, sauf obligation légale de conservation.',
      ],
    },
    {
      heading: 'Vos droits',
      paragraphs: [
        'Vous disposez d’un droit d’accès, de rectification, d’effacement et de limitation du traitement de vos données, ainsi que d’un droit à la portabilité des données (articles 15 à 20 du RGPD). Pour les exercer, écrivez à l’adresse e-mail indiquée ci-dessus. Vous pouvez également introduire une réclamation auprès d’une autorité de contrôle de la protection des données, par exemple la Commissaire à la protection des données et à la liberté d’information du Land de Rhénanie-du-Nord-Westphalie.',
      ],
    },
    {
      heading: 'Droit d’opposition',
      paragraphs: [
        'Lorsque nous traitons vos données sur la base de notre intérêt légitime (article 6, paragraphe 1, point f) du RGPD), vous pouvez vous y opposer à tout moment pour des raisons tenant à votre situation particulière (article 21 du RGPD). Nous ne traitons alors plus ces données, à moins de démontrer des motifs légitimes et impérieux qui prévalent sur vos intérêts, ou que le traitement ne serve à la constatation, à l’exercice ou à la défense de droits en justice.',
      ],
    },
  ],
};

const esPrivacy: LegalDoc = {
  title: 'Política de privacidad',
  description: 'Cómo tratan los datos el sitio web y la aplicación IMAP Transfer.',
  updated: 'Última actualización: octubre de 2026',
  sections: [
    {
      paragraphs: [
        'Esta es una traducción para su comodidad. Solo es jurídicamente vinculante la [versión alemana](/de/datenschutz/).',
      ],
    },
    {
      paragraphs: [
        'En resumen: este sitio web no instala cookies, no cuenta visitantes y no carga nada de otros proveedores. La aplicación IMAP Transfer funciona en su ordenador; su correo y sus datos de acceso se quedan allí, y nosotros no recibimos ningún dato de ella.',
      ],
    },
    { heading: 'Responsable del tratamiento', paragraphs: [`${ADDRESS}\n${EMAIL}`] },
    {
      heading: 'Visita del sitio web',
      paragraphs: [
        'Cuando visita el sitio web, su navegador transmite al servidor de nuestro proveedor de alojamiento la información técnicamente necesaria: dirección IP, fecha y hora, el archivo solicitado y datos sobre su navegador y su sistema operativo. Esta información se trata únicamente para servir el sitio web y garantizar su seguridad, y solo se conserva el tiempo necesario para ello. La base jurídica es nuestro interés legítimo en un funcionamiento seguro (artículo 6, apartado 1, letra f), del RGPD).',
        `Nuestro proveedor de alojamiento es ${HOSTER}, Alemania. Hemos celebrado con él un contrato de encargo del tratamiento conforme al artículo 28 del RGPD.`,
        'Todos los archivos del sitio web, incluidas las fuentes tipográficas, proceden de este servidor. No se carga contenido de otros proveedores ni se instalan cookies.',
      ],
    },
    {
      heading: 'Descargas',
      paragraphs: [
        'Los instaladores se sirven desde el mismo servidor que este sitio web. Al descargar uno se transmite la misma información que al visitar una página, y se aplica lo dicho anteriormente. No interviene ningún otro proveedor.',
      ],
    },
    {
      heading: 'Comprobar un archivo',
      paragraphs: [
        'Cuando arrastra o elige un archivo descargado en el comprobador, su navegador calcula su suma de comprobación en su dispositivo. El archivo no se transmite, ni a nosotros ni a nadie más.',
      ],
    },
    {
      heading: 'La aplicación IMAP Transfer',
      paragraphs: [
        'IMAP Transfer funciona en su ordenador. El correo, las copias de seguridad, los datos de acceso y la configuración se quedan allí; las contraseñas y los inicios de sesión se guardan cifrados en el llavero de su sistema. La aplicación se conecta a los servidores de correo que usted indique.',
        `Si elige «Iniciar sesión con Microsoft», la aplicación abre la página de inicio de sesión de Microsoft en su navegador. Allí se aplica la [declaración de privacidad de Microsoft](${MICROSOFT_PRIVACY}).`,
        `Si usted lo permite en el primer inicio, la aplicación pregunta a GitHub (${GITHUB_ADDRESS}) en cada inicio si hay una versión más reciente y, en ese caso, la descarga. Puede desactivarlo en cualquier momento abajo en la barra lateral. La versión de Microsoft Store no contacta con GitHub; recibe sus actualizaciones a través de la Store. GitHub recibe entonces su dirección IP y los datos técnicos de la solicitud y los trata conforme a su propia [declaración de privacidad](${GITHUB_PRIVACY}). La base jurídica es nuestro interés legítimo en ofrecerle correcciones de errores y actualizaciones de seguridad (artículo 6, apartado 1, letra f), del RGPD).`,
        'Aparte de eso, la aplicación no envía nada: ni estadísticas de uso, ni informes de errores, ni cuenta. No recibimos ningún dato de la aplicación.',
        `IMAP Transfer se ofrece tal cual, y nuestra responsabilidad por la pérdida de datos es limitada. Los detalles figuran en el aviso legal, en [Responsabilidad por la aplicación](${liabilityPath('es')}) (en inglés).`,
      ],
    },
    {
      heading: 'Contacto por correo electrónico',
      paragraphs: [
        'Si nos escribe un correo electrónico, tratamos su dirección y su mensaje para responder a su consulta. La base jurídica es nuestro interés legítimo en responderle (artículo 6, apartado 1, letra f), del RGPD). Suprimimos los datos en cuanto su consulta queda resuelta, salvo que existan obligaciones legales de conservación.',
      ],
    },
    {
      heading: 'Sus derechos',
      paragraphs: [
        'Tiene derecho de acceso, rectificación, supresión y limitación del tratamiento de sus datos, así como derecho a la portabilidad de los datos (artículos 15 a 20 del RGPD). Para ejercerlos, diríjase a la dirección de correo electrónico indicada arriba. También puede presentar una reclamación ante una autoridad de control de protección de datos, por ejemplo ante la Comisionada de Protección de Datos y Libertad de Información del estado federado de Renania del Norte-Westfalia.',
      ],
    },
    {
      heading: 'Derecho de oposición',
      paragraphs: [
        'Cuando tratamos sus datos sobre la base de nuestro interés legítimo (artículo 6, apartado 1, letra f), del RGPD), puede oponerse en cualquier momento por motivos relacionados con su situación particular (artículo 21 del RGPD). En ese caso dejaremos de tratar los datos, salvo que acreditemos motivos legítimos imperiosos que prevalezcan sobre sus intereses, o que el tratamiento sirva para la formulación, el ejercicio o la defensa de reclamaciones.',
      ],
    },
  ],
};

const itPrivacy: LegalDoc = {
  title: 'Informativa sulla privacy',
  description: 'Come il sito web e l’app IMAP Transfer trattano i dati.',
  updated: 'Ultimo aggiornamento: ottobre 2026',
  sections: [
    {
      paragraphs: [
        'Questa è una traduzione di cortesia. Giuridicamente vincolante è soltanto la [versione tedesca](/de/datenschutz/).',
      ],
    },
    {
      paragraphs: [
        'In breve: questo sito non imposta cookie, non conta i visitatori e non carica nulla da altri fornitori. L’app IMAP Transfer funziona sul tuo computer; la tua posta e i tuoi dati di accesso restano lì, e noi non riceviamo alcun dato dall’app.',
      ],
    },
    { heading: 'Titolare del trattamento', paragraphs: [`${ADDRESS}\n${EMAIL}`] },
    {
      heading: 'Visita del sito web',
      paragraphs: [
        'Quando visiti il sito, il tuo browser trasmette al server del nostro fornitore di hosting le informazioni tecnicamente necessarie: indirizzo IP, data e ora, il file richiesto e dati sul browser e sul sistema operativo. Queste informazioni sono trattate solo per fornire il sito e garantirne la sicurezza, e sono conservate solo per il tempo a ciò necessario. La base giuridica è il nostro legittimo interesse a un funzionamento sicuro (art. 6, par. 1, lett. f) del Regolamento (UE) 2016/679, «GDPR»).',
        `Il nostro fornitore di hosting è ${HOSTER}, Germania. Con esso abbiamo stipulato un accordo sul trattamento dei dati ai sensi dell’art. 28 GDPR.`,
        'Tutti i file del sito, compresi i font, provengono da questo server. Non vengono caricati contenuti da altri fornitori e non vengono impostati cookie.',
      ],
    },
    {
      heading: 'Download',
      paragraphs: [
        'I file di installazione sono forniti dallo stesso server di questo sito. Scaricarne uno trasmette le stesse informazioni della visita di una pagina, e vale quanto detto sopra. Nessun altro fornitore è coinvolto.',
      ],
    },
    {
      heading: 'Verifica di un file',
      paragraphs: [
        'Quando trascini o scegli un file scaricato nell’area di verifica, il tuo browser ne calcola il checksum sul tuo dispositivo. Il file non viene trasmesso, né a noi né ad altri.',
      ],
    },
    {
      heading: 'L’app IMAP Transfer',
      paragraphs: [
        'IMAP Transfer funziona sul tuo computer. Posta, backup, dati di accesso e impostazioni restano lì; password e accessi sono conservati cifrati nel portachiavi del tuo sistema. L’app si connette ai server di posta che inserisci.',
        `Se scegli “Accedi con Microsoft”, l’app apre la pagina di accesso di Microsoft nel tuo browser. Lì si applica l’[informativa sulla privacy](${MICROSOFT_PRIVACY}) di Microsoft.`,
        `Se lo consenti al primo avvio, a ogni avvio l’app chiede a GitHub (${GITHUB_ADDRESS}) se esiste una versione più recente e, in tal caso, la scarica. Puoi disattivare questa funzione in qualsiasi momento in fondo alla barra laterale. La versione del Microsoft Store non contatta GitHub; riceve gli aggiornamenti tramite lo Store. GitHub riceve in tal caso il tuo indirizzo IP e i dati tecnici della richiesta e li tratta secondo la propria [informativa sulla privacy](${GITHUB_PRIVACY}). La base giuridica è il nostro legittimo interesse a fornirti correzioni di errori e aggiornamenti di sicurezza (art. 6, par. 1, lett. f) GDPR).`,
        'Oltre a ciò, l’app non invia nulla: niente statistiche d’uso, niente segnalazioni di arresti anomali, nessun account. Non riceviamo alcun dato dall’app.',
        `IMAP Transfer è fornito così com’è, e la nostra responsabilità per la perdita di dati è limitata. I dettagli sono nelle note legali, alla voce [Responsabilità per l’app](${liabilityPath('it')}) (in inglese).`,
      ],
    },
    {
      heading: 'Contatto via e-mail',
      paragraphs: [
        'Se ci scrivi un’e-mail, trattiamo il tuo indirizzo e il tuo messaggio per rispondere alla tua richiesta. La base giuridica è il nostro legittimo interesse a rispondere (art. 6, par. 1, lett. f) GDPR). Cancelliamo i dati una volta evasa la richiesta, salvo obblighi di conservazione previsti dalla legge.',
      ],
    },
    {
      heading: 'I tuoi diritti',
      paragraphs: [
        'Hai diritto di accesso, rettifica, cancellazione e limitazione del trattamento dei tuoi dati, nonché alla portabilità dei dati (artt. da 15 a 20 GDPR). Per esercitarli, scrivi all’indirizzo e-mail indicato sopra. Puoi inoltre proporre reclamo a un’autorità di controllo per la protezione dei dati, ad esempio all’autorità per la protezione dei dati e la libertà d’informazione della Renania Settentrionale-Vestfalia (LDI NRW).',
      ],
    },
    {
      heading: 'Diritto di opposizione',
      paragraphs: [
        'Se trattiamo i tuoi dati sulla base del nostro legittimo interesse (art. 6, par. 1, lett. f) GDPR), puoi opporti in qualsiasi momento per motivi connessi alla tua situazione particolare (art. 21 GDPR). In tal caso non tratteremo più i dati, salvo che dimostriamo l’esistenza di motivi legittimi cogenti che prevalgono sui tuoi interessi, oppure che il trattamento serva per l’accertamento, l’esercizio o la difesa di un diritto in sede giudiziaria.',
      ],
    },
  ],
};

const nlPrivacy: LegalDoc = {
  title: 'Privacyverklaring',
  description: 'Hoe de website en de app IMAP Transfer met gegevens omgaan.',
  updated: 'Laatst bijgewerkt: oktober 2026',
  sections: [
    {
      paragraphs: [
        'Dit is een vertaling. Alleen de [Duitse versie](/de/datenschutz/) is juridisch bindend.',
      ],
    },
    {
      paragraphs: [
        'In het kort: deze website plaatst geen cookies, telt geen bezoekers en laadt niets van andere aanbieders. De app IMAP Transfer draait op uw computer; uw mail en inloggegevens blijven daar, en wij ontvangen er geen gegevens van.',
      ],
    },
    { heading: 'Verwerkingsverantwoordelijke', paragraphs: [`${ADDRESS}\n${EMAIL}`] },
    {
      heading: 'Bezoek van de website',
      paragraphs: [
        'Wanneer u de website bezoekt, stuurt uw browser technisch noodzakelijke gegevens naar de server van onze hostingprovider: IP-adres, datum en tijd, het opgevraagde bestand en gegevens over uw browser en besturingssysteem. Deze gegevens worden alleen verwerkt om de website te leveren en te beveiligen, en worden niet langer bewaard dan daarvoor nodig is. De rechtsgrond is ons gerechtvaardigd belang bij een veilige werking (artikel 6, lid 1, onder f, AVG).',
        `Onze hostingprovider is ${HOSTER}, Duitsland. Met deze provider hebben wij een verwerkersovereenkomst gesloten op grond van artikel 28 AVG.`,
        'Alle bestanden van de website, ook de lettertypen, komen van deze server. Er wordt geen inhoud van andere aanbieders geladen en er worden geen cookies geplaatst.',
      ],
    },
    {
      heading: 'Downloads',
      paragraphs: [
        'De installatiebestanden staan op dezelfde server als deze website. Bij het downloaden stuurt uw browser dezelfde gegevens als bij het bezoeken van een pagina, en geldt wat hierboven staat. Er zijn geen andere aanbieders bij betrokken.',
      ],
    },
    {
      heading: 'Bestand controleren',
      paragraphs: [
        'Wanneer u een gedownload bestand naar het controlevak sleept of het kiest, berekent uw browser de controlesom op uw apparaat. Het bestand wordt daarbij niet verzonden, niet naar ons en niet naar anderen.',
      ],
    },
    {
      heading: 'De app IMAP Transfer',
      paragraphs: [
        'IMAP Transfer draait op uw computer. Mail, back-ups, inloggegevens en instellingen blijven daar; wachtwoorden en aanmeldingen worden versleuteld bewaard in de sleutelhanger van uw systeem. De app maakt verbinding met de mailservers die u invoert.',
        `Kiest u ‘Aanmelden met Microsoft’, dan opent de app de aanmeldpagina van Microsoft in uw browser. Daar geldt de [privacyverklaring van Microsoft](${MICROSOFT_PRIVACY}).`,
        `Als u dat bij de eerste start toestaat, vraagt de app bij elke start aan GitHub (${GITHUB_ADDRESS}) of er een nieuwere versie is en downloadt die zo nodig. U kunt dit altijd uitschakelen onder in de zijbalk. De versie uit de Microsoft Store neemt geen contact op met GitHub; die krijgt haar updates via de Store. GitHub ontvangt daarbij uw IP-adres en de technische gegevens van het verzoek en verwerkt die volgens zijn eigen [privacyverklaring](${GITHUB_PRIVACY}). De rechtsgrond is ons gerechtvaardigd belang om u foutoplossingen en beveiligingsupdates te bieden (artikel 6, lid 1, onder f, AVG).`,
        'Verder verstuurt de app niets: geen gebruiksstatistieken, geen crashrapporten, geen account. Wij ontvangen geen gegevens van de app.',
        `IMAP Transfer wordt geleverd zoals het is, en onze aansprakelijkheid voor gegevensverlies is beperkt. De details staan in het colofon onder [Aansprakelijkheid voor de app](${liabilityPath('nl')}) (in het Engels).`,
      ],
    },
    {
      heading: 'Contact per e-mail',
      paragraphs: [
        'Als u ons e-mailt, verwerken wij uw adres en uw bericht om uw vraag te beantwoorden. De rechtsgrond is ons gerechtvaardigd belang bij het beantwoorden ervan (artikel 6, lid 1, onder f, AVG). Wij verwijderen de gegevens zodra uw vraag is afgehandeld, tenzij wettelijke bewaarplichten gelden.',
      ],
    },
    {
      heading: 'Uw rechten',
      paragraphs: [
        'U hebt het recht op inzage, rectificatie, wissing en beperking van de verwerking van uw gegevens en het recht op overdraagbaarheid van gegevens (artikelen 15 tot en met 20 AVG). Neem daarvoor contact op via het hierboven genoemde e-mailadres. U kunt ook een klacht indienen bij een toezichthoudende autoriteit voor gegevensbescherming, bijvoorbeeld bij de Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.',
      ],
    },
    {
      heading: 'Recht van bezwaar',
      paragraphs: [
        'Verwerken wij uw gegevens op grond van ons gerechtvaardigd belang (artikel 6, lid 1, onder f, AVG), dan kunt u daartegen te allen tijde bezwaar maken om redenen die verband houden met uw specifieke situatie (artikel 21 AVG). Wij verwerken de gegevens dan niet meer, tenzij wij dwingende gerechtvaardigde gronden aantonen die zwaarder wegen dan uw belangen, of de verwerking dient voor de instelling, uitoefening of onderbouwing van een rechtsvordering.',
      ],
    },
  ],
};

const ptPrivacy: LegalDoc = {
  title: 'Política de privacidade',
  description: 'Como o site e a aplicação IMAP Transfer tratam os dados.',
  updated: 'Última atualização: outubro de 2026',
  sections: [
    {
      paragraphs: [
        'Esta política de privacidade é uma tradução. Apenas a [versão alemã](/de/datenschutz/) é juridicamente vinculativa.',
      ],
    },
    {
      paragraphs: [
        'Em resumo: este site não usa cookies, não conta visitantes e não carrega nada de outros fornecedores. A aplicação IMAP Transfer corre no seu computador; os seus e-mails e dados de acesso ficam lá, e não recebemos dela quaisquer dados.',
      ],
    },
    { heading: 'Responsável pelo tratamento', paragraphs: [`${ADDRESS}\n${EMAIL}`] },
    {
      heading: 'Visita ao site',
      paragraphs: [
        'Quando visita o site, o seu browser transmite ao servidor do nosso fornecedor de alojamento as informações tecnicamente necessárias: endereço IP, data e hora, o ficheiro pedido e dados sobre o browser e o sistema operativo. Estas informações são tratadas apenas para disponibilizar o site e garantir a sua segurança, e só são conservadas durante o tempo necessário para esse fim. O fundamento jurídico é o nosso interesse legítimo num funcionamento seguro (artigo 6.º, n.º 1, alínea f), do RGPD).',
        `O nosso fornecedor de alojamento é a ${HOSTER}, Alemanha. Celebrámos com ela um contrato de subcontratação nos termos do artigo 28.º do RGPD.`,
        'Todos os ficheiros do site, incluindo os tipos de letra, vêm deste servidor. Não é carregado qualquer conteúdo de outros fornecedores, e não são usados cookies.',
      ],
    },
    {
      heading: 'Transferências',
      paragraphs: [
        'Os instaladores estão no mesmo servidor que este site. Ao transferir um deles, o seu browser transmite as mesmas informações que ao visitar uma página, e aplica-se o que foi dito acima. Nenhum outro fornecedor está envolvido.',
      ],
    },
    {
      heading: 'Verificar um ficheiro',
      paragraphs: [
        'Quando arrasta ou escolhe um ficheiro transferido na área de verificação, o seu browser calcula a soma de verificação no seu dispositivo. O ficheiro não é transmitido, nem a nós nem a terceiros.',
      ],
    },
    {
      heading: 'A aplicação IMAP Transfer',
      paragraphs: [
        'O IMAP Transfer corre no seu computador. E-mails, cópias de segurança, dados de acesso e definições ficam lá; as palavras-passe e os inícios de sessão são guardados encriptados no porta-chaves do seu sistema. A aplicação liga-se aos servidores de e-mail que indicar.',
        `Se escolher «Iniciar sessão com a Microsoft», a aplicação abre a página de início de sessão da Microsoft no seu browser. Aí aplica-se a [declaração de privacidade da Microsoft](${MICROSOFT_PRIVACY}).`,
        `Se o permitir no primeiro arranque, a aplicação pergunta ao GitHub (${GITHUB_ADDRESS}), em cada arranque, se existe uma versão mais recente e, se for o caso, transfere-a. Pode desativar isto a qualquer momento na parte inferior da barra lateral. A versão da Microsoft Store não contacta o GitHub; recebe as atualizações através da Store. O GitHub recebe assim o seu endereço IP e os dados técnicos do pedido e trata-os nos termos da sua própria [declaração de privacidade](${GITHUB_PRIVACY}). O fundamento jurídico é o nosso interesse legítimo em disponibilizar-lhe correções de erros e atualizações de segurança (artigo 6.º, n.º 1, alínea f), do RGPD).`,
        'Para além disso, a aplicação não envia nada: sem estatísticas de utilização, sem relatórios de falhas, sem conta. Não recebemos quaisquer dados da aplicação.',
        `O IMAP Transfer é disponibilizado tal como está, e a nossa responsabilidade pela perda de dados é limitada. Os pormenores estão na informação legal, em [Responsabilidade pela aplicação](${liabilityPath('pt')}) (em inglês).`,
      ],
    },
    {
      heading: 'Contacto por e-mail',
      paragraphs: [
        'Se nos enviar um e-mail, tratamos o seu endereço e a sua mensagem para responder ao seu pedido. O fundamento jurídico é o nosso interesse legítimo em responder (artigo 6.º, n.º 1, alínea f), do RGPD). Apagamos os dados assim que o seu pedido estiver resolvido, salvo se existirem obrigações legais de conservação.',
      ],
    },
    {
      heading: 'Os seus direitos',
      paragraphs: [
        'Tem o direito de acesso, retificação, apagamento e limitação do tratamento dos seus dados, bem como o direito de portabilidade dos dados (artigos 15.º a 20.º do RGPD). Para os exercer, contacte o endereço de e-mail indicado acima. Pode também apresentar reclamação junto de uma autoridade de controlo de proteção de dados, por exemplo a Comissária para a Proteção de Dados e a Liberdade de Informação do estado da Renânia do Norte-Vestefália.',
      ],
    },
    {
      heading: 'Direito de oposição',
      paragraphs: [
        'Quando tratamos os seus dados com base no nosso interesse legítimo (artigo 6.º, n.º 1, alínea f), do RGPD), pode opor-se a esse tratamento a qualquer momento, por motivos relacionados com a sua situação particular (artigo 21.º do RGPD). Deixaremos então de tratar os dados, salvo se apresentarmos razões imperiosas e legítimas que prevaleçam sobre os seus interesses, ou se o tratamento servir para a declaração, o exercício ou a defesa de um direito num processo judicial.',
      ],
    },
  ],
};

/** The privacy policy in every language; the legal notice only in those of IMPRINT_LANGS. */
export const LEGAL: Record<Lang, { imprint?: LegalDoc; privacy: LegalDoc }> = {
  de: {
    imprint: {
      title: 'Impressum',
      description: 'Anbieterkennzeichnung der Website von IMAP Transfer.',
      updated: 'Stand: Oktober 2026',
      sections: [
        { heading: 'Angaben gemäß § 5 DDG', paragraphs: [ADDRESS] },
        { heading: 'Kontakt', paragraphs: [`Telefon: ${PHONE}\nE-Mail: ${EMAIL}`] },
        { heading: 'Umsatzsteuer-Identifikationsnummer', paragraphs: [`gemäß § 27 a Umsatzsteuergesetz: ${VAT}`] },
        {
          heading: 'Marken',
          paragraphs: [
            `${TRADEMARKS.replace(/, macOS and Windows$/, ', macOS und Windows')} sind Marken ihrer jeweiligen Inhaber. IMAP Transfer ist ein unabhängiges Projekt und steht in keiner Verbindung zu ihnen.`,
          ],
        },
        {
          heading: 'Lizenzen',
          paragraphs: [
            `IMAP Transfer ist freie Software unter der [MIT-Lizenz](${LICENSE}). Die App baut auf freier Software anderer auf. Die wichtigsten Bausteine:`,
            [
              '**ImapFlow** spricht mit den Mailservern: © Postal Systems OÜ, MIT-Lizenz.',
              '**libmime** und **mailsplit** lesen die Mails: © Andris Reinman und Zone Media OÜ, MIT-Lizenz.',
              '**Electron** mit **Chromium** trägt die Desktop-App: © GitHub Inc. und die Electron-Beitragenden, MIT-Lizenz; Chromium unter der BSD-Lizenz und weiteren freien Lizenzen.',
              '**Vue.js** und **Vue I18n** bauen die Oberfläche: © Evan You und kazuya kawaguchi, MIT-Lizenz.',
              '**electron-updater** holt neue Versionen: © Loopline Systems, MIT-Lizenz.',
              '**Commander** liest die Befehle der Kommandozeile: © TJ Holowaychuk, MIT-Lizenz.',
            ].join('\n'),
            'Jede Installation enthält die vollständige Liste aller Bausteine mit ihren Lizenztexten, im Ordner „licenses“ unter den Ressourcen der App. Die Kommandozeile bringt die Lizenztexte mit ihren Paketen mit.',
            `Diese Website nutzt die Schriften Newsreader (© The Newsreader Project Authors) und Hanken Grotesk (© The Hanken Grotesk Project Authors) unter der SIL Open Font License 1.1. Die Lizenztexte liegen bei den Schriftdateien: [Newsreader](${FONT_LICENSES.newsreader}), [Hanken Grotesk](${FONT_LICENSES.hanken}).`,
          ],
        },
        {
          heading: 'Haftung für die App',
          id: LIABILITY.de,
          paragraphs: [
            'IMAP Transfer wird kostenlos und so bereitgestellt, wie es ist: ohne Gewähr dafür, dass die App fehlerfrei läuft oder für Ihren Zweck taugt. So steht es auch in der MIT-Lizenz. Soweit deutsches Recht gilt, haften wir wie bei einer Schenkung: nur für Vorsatz und grobe Fahrlässigkeit (§ 521 BGB) und für Mängel der App nur, wenn wir sie arglistig verschwiegen haben (§ 524 BGB). Das gilt auch für den Verlust oder die Veränderung von Mails und anderen Daten. Unberührt bleibt die Haftung, die das Gesetz zwingend vorschreibt, etwa nach dem Produkthaftungsgesetz.',
            'Wiederherstellen, Umziehen, Abgleichen und Aufräumen schreiben in ein Postfach; Abgleichen und Aufräumen verschieben dabei Mails in den Papierkorb. Fehler von Servern, Verbindungen oder der App lassen sich nie ganz ausschließen. Sichern Sie Ihre Mails deshalb vor jedem dieser Schritte, und prüfen Sie danach das Ergebnis. Die Sicherung kann IMAP Transfer selbst anlegen.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Datenschutzerklärung',
      description: 'Wie die Website und die App IMAP Transfer mit Daten umgehen.',
      updated: 'Stand: Oktober 2026',
      sections: [
        {
          paragraphs: [
            'Kurz gesagt: Diese Website setzt keine Cookies, zählt keine Besucher und lädt nichts von anderen Anbietern. Die App IMAP Transfer läuft auf Ihrem Computer; Ihre Mails und Zugangsdaten bleiben dort, und wir erhalten von ihr keine Daten.',
          ],
        },
        { heading: 'Verantwortlicher', paragraphs: [`${ADDRESS}\n${EMAIL}`] },
        {
          heading: 'Aufruf der Website',
          paragraphs: [
            'Beim Aufruf der Website überträgt Ihr Browser technisch notwendige Angaben an den Server unseres Hosting-Anbieters: IP-Adresse, Datum und Uhrzeit, die abgerufene Datei sowie Angaben zu Browser und Betriebssystem. Sie werden nur verarbeitet, um die Website auszuliefern und ihre Sicherheit zu gewährleisten, und nur so lange gespeichert, wie es dafür nötig ist. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).',
            `Unser Hosting-Anbieter ist die ${HOSTER}. Mit ihr besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.`,
            'Alle Dateien der Website, auch die Schriften, kommen von diesem Server. Es werden keine Inhalte von anderen Anbietern nachgeladen, und es werden keine Cookies gesetzt.',
          ],
        },
        {
          heading: 'Herunterladen',
          paragraphs: [
            'Die Installationsdateien liegen auf demselben Server wie diese Website. Beim Herunterladen überträgt Ihr Browser dieselben Angaben wie beim Aufruf einer Seite, und es gilt das oben Gesagte. Andere Anbieter sind daran nicht beteiligt.',
          ],
        },
        {
          heading: 'Datei prüfen',
          paragraphs: [
            'Wenn Sie eine heruntergeladene Datei auf die Prüffläche ziehen oder auswählen, berechnet Ihr Browser ihre Prüfsumme auf Ihrem Gerät. Die Datei wird dabei nicht übertragen, weder an uns noch an andere.',
          ],
        },
        {
          heading: 'Die App IMAP Transfer',
          paragraphs: [
            'IMAP Transfer läuft auf Ihrem Computer. Mails, Sicherungen, Zugangsdaten und Einstellungen bleiben dort; Passwörter und Anmeldungen liegen verschlüsselt im Schlüsselbund Ihres Systems. Die App verbindet sich mit den Mailservern, die Sie eintragen.',
            `Wählen Sie „Mit Microsoft anmelden“, öffnet die App die Anmeldeseite von Microsoft in Ihrem Browser. Dort gilt die [Datenschutzerklärung von Microsoft](${MICROSOFT_PRIVACY}).`,
            `Wenn Sie es beim ersten Start erlauben, fragt die App bei jedem Start bei GitHub (${GITHUB_ADDRESS}) nach, ob es eine neuere Version gibt, und lädt sie gegebenenfalls herunter. Sie können das jederzeit unten in der Seitenleiste abschalten. Die Version aus dem Microsoft Store fragt nicht bei GitHub nach, sie bekommt ihre Updates über den Store. GitHub erhält dabei Ihre IP-Adresse und die technischen Angaben der Anfrage und verarbeitet sie nach seiner eigenen [Datenschutzerklärung](${GITHUB_PRIVACY}). Rechtsgrundlage ist unser berechtigtes Interesse, Ihnen Fehlerbehebungen und Sicherheitsupdates bereitzustellen (Art. 6 Abs. 1 lit. f DSGVO).`,
            'Darüber hinaus sendet die App nichts: keine Nutzungsstatistik, keine Absturzberichte, kein Konto. Wir erhalten von der App keine Daten.',
            `IMAP Transfer wird so bereitgestellt, wie es ist, und für Datenverlust haften wir nur beschränkt. Die Einzelheiten stehen im Impressum unter [Haftung für die App](${liabilityPath('de')}).`,
          ],
        },
        {
          heading: 'Kontakt per E-Mail',
          paragraphs: [
            'Wenn Sie uns eine E-Mail schreiben, verarbeiten wir Ihre Adresse und Ihre Nachricht, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist unser berechtigtes Interesse an der Antwort (Art. 6 Abs. 1 lit. f DSGVO). Wir löschen die Daten, sobald Ihre Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen.',
          ],
        },
        {
          heading: 'Ihre Rechte',
          paragraphs: [
            'Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten sowie auf Datenübertragbarkeit (Art. 15 bis 20 DSGVO). Wenden Sie sich dafür an die oben genannte E-Mail-Adresse. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.',
          ],
        },
        {
          heading: 'Widerspruchsrecht',
          paragraphs: [
            'Verarbeiten wir Ihre Daten auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO), können Sie dem jederzeit widersprechen, wenn sich dafür Gründe aus Ihrer besonderen Situation ergeben (Art. 21 DSGVO). Wir verarbeiten die Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen, die Ihre Interessen überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.',
          ],
        },
      ],
    },
  },
  en: {
    imprint: {
      title: 'Legal notice',
      description: 'Information about the provider of the IMAP Transfer website.',
      updated: 'Last updated: October 2026',
      sections: [
        { heading: 'Information pursuant to § 5 DDG (German Digital Services Act)', paragraphs: [ADDRESS] },
        { heading: 'Contact', paragraphs: [`Phone: ${PHONE}\nEmail: ${EMAIL}`] },
        { heading: 'VAT identification number', paragraphs: [`pursuant to § 27 a of the German VAT Act (UStG): ${VAT}`] },
        {
          heading: 'Trademarks',
          paragraphs: [`${TRADEMARKS} are trademarks of their respective owners. IMAP Transfer is an independent project and is not affiliated with them.`],
        },
        {
          heading: 'Licenses',
          paragraphs: [
            `IMAP Transfer is free software under the [MIT license](${LICENSE}). The app is built on free software by others. The main building blocks:`,
            [
              '**ImapFlow** talks to the mail servers: © Postal Systems OÜ, MIT license.',
              '**libmime** and **mailsplit** read the messages: © Andris Reinman and Zone Media OÜ, MIT license.',
              '**Electron** with **Chromium** carries the desktop app: © GitHub Inc. and the Electron contributors, MIT license; Chromium under the BSD license and further free licenses.',
              '**Vue.js** and **Vue I18n** build the interface: © Evan You and kazuya kawaguchi, MIT license.',
              '**electron-updater** fetches new versions: © Loopline Systems, MIT license.',
              '**Commander** reads the commands of the command line: © TJ Holowaychuk, MIT license.',
            ].join('\n'),
            'Every installation contains the complete list of building blocks with their license texts, in the “licenses” folder among the app’s resources. The command line brings the license texts along with its packages.',
            `This website uses the typefaces Newsreader (© The Newsreader Project Authors) and Hanken Grotesk (© The Hanken Grotesk Project Authors) under the SIL Open Font License 1.1. The license texts sit next to the font files: [Newsreader](${FONT_LICENSES.newsreader}), [Hanken Grotesk](${FONT_LICENSES.hanken}).`,
          ],
        },
        {
          heading: 'Liability for the app',
          id: LIABILITY.en,
          paragraphs: [
            'IMAP Transfer is provided free of charge and as is: without any warranty that the app works without errors or suits your purpose. The MIT license says the same. Where German law applies, we are liable as for a gift: only for intent and gross negligence (Section 521 BGB), and for defects of the app only if we fraudulently concealed them (Section 524 BGB). This also applies to the loss or alteration of mail and other data. Liability that the law makes mandatory, such as under the German Product Liability Act, remains unaffected.',
            'Restoring, migrating, syncing and cleaning up write to a mailbox; syncing and cleaning up move messages to the trash. Errors of servers, connections or the app can never be ruled out entirely. Back up your mail before each of these steps, and check the result afterwards. IMAP Transfer can make this backup itself.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy policy',
      description: 'How the website and the app IMAP Transfer handle data.',
      updated: 'Last updated: October 2026',
      sections: [
        {
          paragraphs: [
            'In short: this website sets no cookies, counts no visitors and loads nothing from other providers. The app IMAP Transfer runs on your computer; your mail and sign-in details stay there, and we receive no data from it.',
          ],
        },
        { heading: 'Controller', paragraphs: [`${ADDRESS}\n${EMAIL}`] },
        {
          heading: 'Visiting the website',
          paragraphs: [
            'When you visit the website, your browser transmits technically necessary information to the server of our hosting provider: IP address, date and time, the requested file and details about your browser and operating system. This information is processed only to deliver the website and keep it secure, and is stored only as long as necessary for that. The legal basis is our legitimate interest in secure operation (Art. 6(1)(f) GDPR).',
            `Our hosting provider is ${HOSTER}, Germany. We have concluded a data processing agreement with it under Art. 28 GDPR.`,
            'All files of the website, including the fonts, come from this server. No content is loaded from other providers, and no cookies are set.',
          ],
        },
        {
          heading: 'Downloads',
          paragraphs: [
            'The installers are served by the same server as this website. Downloading one transmits the same information as visiting a page, and what is said above applies. No other provider is involved.',
          ],
        },
        {
          heading: 'Checking a file',
          paragraphs: [
            'When you drop or choose a downloaded file on the checker, your browser computes its checksum on your device. The file is not transmitted, neither to us nor to anyone else.',
          ],
        },
        {
          heading: 'The app IMAP Transfer',
          paragraphs: [
            'IMAP Transfer runs on your computer. Mail, backups, sign-in details and settings stay there; passwords and sign-ins are stored encrypted in your system’s key store. The app connects to the mail servers you enter.',
            `If you choose “Sign in with Microsoft”, the app opens Microsoft’s sign-in page in your browser. Microsoft’s [privacy statement](${MICROSOFT_PRIVACY}) applies there.`,
            `If you allow it at the first start, the app asks GitHub (${GITHUB_ADDRESS}) at every start whether there is a newer version and, if so, downloads it. You can switch this off at any time at the bottom of the sidebar. The version from the Microsoft Store does not contact GitHub; it gets its updates through the Store. GitHub then receives your IP address and the technical details of the request and processes them under its own [privacy statement](${GITHUB_PRIVACY}). The legal basis is our legitimate interest in providing you with bug fixes and security updates (Art. 6(1)(f) GDPR).`,
            'Beyond that, the app sends nothing: no usage statistics, no crash reports, no account. We receive no data from the app.',
            `IMAP Transfer is provided as is, and our liability for data loss is limited. The details are in the legal notice under [Liability for the app](${liabilityPath('en')}).`,
          ],
        },
        {
          heading: 'Contact by email',
          paragraphs: [
            'If you email us, we process your address and your message in order to answer your request. The legal basis is our legitimate interest in answering it (Art. 6(1)(f) GDPR). We delete the data once your request has been dealt with, unless statutory retention obligations apply.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You have the right of access, rectification, erasure and restriction of processing of your data and the right to data portability (Art. 15 to 20 GDPR). To exercise them, contact the email address given above. You can also lodge a complaint with a data protection supervisory authority, for example the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia.',
          ],
        },
        {
          heading: 'Right to object',
          paragraphs: [
            'Where we process your data on the basis of our legitimate interest (Art. 6(1)(f) GDPR), you may object to this at any time on grounds relating to your particular situation (Art. 21 GDPR). We will then no longer process the data unless we can demonstrate compelling legitimate grounds that override your interests, or the processing serves the establishment, exercise or defence of legal claims.',
          ],
        },
      ],
    },
  },
  fr: { privacy: frPrivacy },
  es: { privacy: esPrivacy },
  it: { privacy: itPrivacy },
  nl: { privacy: nlPrivacy },
  pt: { privacy: ptPrivacy },
};
