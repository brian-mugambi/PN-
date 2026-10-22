import ProfileNetwork from './profile/ProfileNetwork';

function useProfileRoute() {
  const path = window.location.pathname;
  const match = path.match(/^\/profile\/([^/]+)(\/ad)?\/?$/);
  if (match) {
    return {
      username: decodeURIComponent(match[1]),
      view: match[2] ? ('ad' as const) : undefined,
    };
  }
  return { username: undefined, view: undefined };
}

export default function App() {
  const route = useProfileRoute();
  return <ProfileNetwork username={route.username} view={route.view} />;
}
