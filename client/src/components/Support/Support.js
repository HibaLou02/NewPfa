import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ArticleIcon from '@mui/icons-material/Article';

const faqData = [
  {
    question: "Comment créer un nouveau dossier patient ?",
    answer: "Pour créer un nouveau dossier patient, cliquez sur le bouton 'Nouveau Patient' dans la section Patients. Remplissez ensuite le formulaire avec les informations requises et cliquez sur 'Enregistrer'."
  },
  {
    question: "Comment gérer les rendez-vous ?",
    answer: "La gestion des rendez-vous se fait depuis le calendrier. Vous pouvez ajouter un nouveau rendez-vous en cliquant sur une plage horaire libre, ou modifier un rendez-vous existant en cliquant dessus."
  },
  {
    question: "Comment générer un rapport ?",
    answer: "Accédez à la section Rapports, sélectionnez le type de rapport souhaité, définissez la période concernée, puis cliquez sur 'Générer le Rapport'."
  }
];

const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi du formulaire de support à implémenter
    console.log('Support request:', { name, email, message });
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Centre d'Aide et Support
      </Typography>

      {/* Quick Links */}
      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} md={4}>
          <Paper elevation={2} className="p-4 text-center">
            <HelpOutlineIcon color="primary" className="text-4xl mb-2" />
            <Typography variant="h6">Guide d'Utilisation</Typography>
            <Typography variant="body2" color="textSecondary">
              Consultez notre documentation détaillée
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} className="p-4 text-center">
            <ContactSupportIcon color="primary" className="text-4xl mb-2" />
            <Typography variant="h6">Support Technique</Typography>
            <Typography variant="body2" color="textSecondary">
              Contactez notre équipe technique
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} className="p-4 text-center">
            <ArticleIcon color="primary" className="text-4xl mb-2" />
            <Typography variant="h6">Tutoriels Vidéo</Typography>
            <Typography variant="body2" color="textSecondary">
              Apprenez par l'exemple
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Typography variant="h5" className="mb-4">
        Questions Fréquentes
      </Typography>
      <Box className="mb-8">
        {faqData.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Contact Form */}
      <Card className="mb-8">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Contactez le Support
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Envoyer
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Support; 