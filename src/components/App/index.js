import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import Cookies from 'js-cookie';
import { classes } from '../../utils';
import { Header, Scheduler, Map, NavDrawer, NavMenu, Attribution } from '..';
import { Oscar } from '../../beans';
import { useCookie, useJsonCookie, useMobile } from '../../hooks';
import {
  ScheduleContext,
  TermsContext,
  ThemeContext,
  VersionsContext
} from '../../contexts';
import { defaultScheduleData } from '../../types';

import 'react-virtualized/styles.css';
import './stylesheet.scss';

const NAV_TABS = ['Scheduler', 'Map'];

const App = () => {
  const [terms, setTerms] = useState([]);
  const [versions, setVersions] = useState(['Primary', 'New']);
  const [oscar, setOscar] = useState(null);

  // Persist the theme, term, and some term data as cookies
  const [theme, setTheme] = useCookie('theme', 'dark');
  const [term, setTerm] = useCookie('term');
  const [versionName, setVersionName] = useCookie('version');
  const [scheduleData, patchScheduleData] = useJsonCookie(
    term ? term.concat(versionName) : ''.concat(versionName),
    defaultScheduleData
  );

  // Memoize context values so that their references are stable
  const themeContextValue = useMemo(() => [theme, setTheme], [theme, setTheme]);
  const termsContextValue = useMemo(() => [terms, setTerms], [terms, setTerms]);
  const scheduleContextValue = useMemo(
    () => [
      { term, versionName, oscar, ...scheduleData },
      { setTerm, setVersionName, setOscar, patchScheduleData }
    ],
    [term, oscar, scheduleData, setTerm, setOscar, patchScheduleData]
  );
  const versionsContextValue = useMemo(() => [versions, setVersions], [
    versions,
    setVersions
  ]);

  // display popup when first visiting the site
  useEffect(() => {
    const cookieKey = 'visited-merge-notice';
    if (!Cookies.get(cookieKey)) {
      swal({
        button: 'Got It!',
        content: (
          <div>
            <img
              style={{ width: '175px' }}
              alt="GT Scheduler Logo"
              src="/mascot.png"
            />
            <h1>GT Scheduler</h1>
            <p>
              Hey there, yellow jackets!{' '}
              <a href="https://github.com/gt-scheduler">GT Scheduler</a> is a
              new collaboration between{' '}
              <a href="https://bitsofgood.org/">Bits of Good</a> and{' '}
              <a href="https://jasonpark.me/">Jason (Jinseo) Park</a> aimed at
              making class registration easier for everybody! Now, you can
              access course prerequisites, instructor GPAs, live seating
              information, and more all in one location.
            </p>
            <p>
              If you enjoy our work and are interested in contributing, feel
              free to{' '}
              <a href="https://github.com/gt-scheduler/website/pulls">
                open a pull request
              </a>{' '}
              with your improvements. Thank you and enjoy!
            </p>
          </div>
        )
      });

      Cookies.set(cookieKey, true, { expires: 365 });
    }
  }, []);

  // Fetch the current term's scraper information
  useEffect(() => {
    setOscar(null);
    if (term) {
      axios
        .get(`https://gt-scheduler.github.io/crawler/${term}.json`)
        .then((res) => {
          const newOscar = new Oscar(res.data);
          setOscar(newOscar);
        });
    }
  }, [term]);

  // Fetch all terms via the GitHub API
  useEffect(() => {
    axios
      .get(
        'https://api.github.com/repos/gt-scheduler/crawler/contents?ref=gh-pages'
      )
      .then((res) => {
        const newTerms = res.data
          .map((content) => content.name)
          .filter((name) => /\d{6}\.json/.test(name))
          .map((name) => name.replace(/\.json$/, ''))
          .sort()
          .reverse();
        setTerms(newTerms);
      });
  }, [setTerms]);

  // Set the term to be the first one if it is unset
  // (once the terms load)
  useEffect(() => {
    if (!term) {
      const [recentTerm] = terms;
      setTerm(recentTerm);
    }
  }, [terms, term, setTerm]);

  // Initialize the versionName to Primary
  useEffect(() => {
    if (!versionName) {
      setVersionName('Primary');
    }
  }, [versionName, setVersionName]);

  // Re-render when the page is re-sized to become mobile/desktop
  // (desktop is >= 1024 px wide)
  const mobile = useMobile();
  const className = classes('App', mobile && 'mobile', theme);

  // Allow top-level tab-based navigation
  const [currentTabIndex, setTabIndex] = useState(0);

  // Handle the status of the drawer being open on mobile
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  useEffect(() => {
    // Close the drawer if switching to desktop
    if (isDrawerOpen && !mobile) {
      setIsDrawerOpen(false);
    }
  }, [isDrawerOpen, mobile]);

  // If the scraped JSON hasn't been loaded,
  // then show an empty div as a loading intermediate
  if (!oscar) {
    return <div className={className} />;
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <VersionsContext.Provider value={versionsContextValue}>
        <TermsContext.Provider value={termsContextValue}>
          <ScheduleContext.Provider value={scheduleContextValue}>
            <div className={classes('App', className)}>
              {/* On mobile, show the nav drawer + overlay */}
              {mobile && (
                <NavDrawer open={isDrawerOpen} onClose={closeDrawer}>
                  <NavMenu
                    items={NAV_TABS}
                    currentItem={currentTabIndex}
                    onChangeItem={setTabIndex}
                  />
                </NavDrawer>
              )}
              {/* The header controls top-level navigation
            and is always present */}
              <Header
                currentTab={currentTabIndex}
                onChangeTab={setTabIndex}
                onToggleMenu={openDrawer}
                tabs={NAV_TABS}
              />
              {currentTabIndex === 0 && <Scheduler />}
              {currentTabIndex === 1 && <Map />}
              <Attribution />
            </div>
          </ScheduleContext.Provider>
        </TermsContext.Provider>
      </VersionsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
