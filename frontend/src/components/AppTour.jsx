import React from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

function AppTour() {
  const location = useLocation();
  const [runTour, setRunTour] = React.useState(false);

  const steps = [
    {
      target: 'body',
      content: 'Welcome to RouteRelief! This quick walkthrough will show you the main parts of the app.',
      placement: 'center'
    },
    {
      target: '.nav-community',
      content: 'This is the Community page. Here you can see posts from people asking for help or offering help.',
      placement: 'top'
    },
    {
      target: '.tour-create-post',
      content: 'Tap this plus button to create a new post when you need help or want to offer support.',
      placement: 'left'
    },
    {
      target: '.nav-notifications',
      content: 'Notifications show replies and updates connected to your posts and conversations.',
      placement: 'top'
    },
    {
      target: '.nav-map',
      content: 'Use the Map to find shelters, food resources, community centres, and emergency support locations nearby.',
      placement: 'top'
    },
    {
      target: '.nav-info',
      content: 'The Info page has disaster guides with tips for before, during, and after emergencies.',
      placement: 'top'
    },
    {
      target: '.nav-profile',
      content: 'Your Profile lets you update your role, manage your posts, and change your first-time mode.',
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
      await fetch(`${API_URL}/walkthrough/complete`, {
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
      disableBeacon={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 99999
        }
      }}
    />
  );
}

export default AppTour;