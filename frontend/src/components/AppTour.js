import React from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';

function AppTour() {
  const location = useLocation();
  const [runTour, setRunTour] = React.useState(false);

  const steps = [
    {
      target: '.nav-community',
      content: 'This is the Community page. Here you can see posts from people asking for help or offering help.',
      placement: 'top'
    },
    {
      target: '.nav-post',
      content: 'Use Post to ask for help or offer support to your community.',
      placement: 'top'
    },
    {
      target: '.nav-map',
      content: 'Use the Map to find shelters, resources, and safe locations nearby.',
      placement: 'top'
    },
    {
      target: '.nav-info',
      content: 'The Info page has emergency tips and helpful guidance.',
      placement: 'top'
    },
    {
      target: '.nav-profile',
      content: 'Your Profile lets you update your role, manage your posts, and change settings.',
      placement: 'top'
    }
  ];

  React.useEffect(() => {
    if (location.state?.startTour) {
      setRunTour(true);
    }
  }, [location.state]);

  const finishTour = async () => {
    setRunTour(false);

    try {
      await fetch('http://localhost:5000/walkthrough/complete', {
        method: 'PUT',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error saving walkthrough completion:', error);
    }
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      finishTour();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      disableScrolling={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000
        }
      }}
    />
  );
}

export default AppTour;