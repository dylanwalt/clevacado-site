import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type MouseEvent } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, CircleHelp,
  Factory, Leaf, LockKeyhole, Menu, Snowflake, Tractor, Truck, Waves, X,
} from 'lucide-react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { track, trackOnce } from './lib/analytics';

const journeyStages = [
  { number: '01', title: 'Harvest', detail: 'Picking and first handling', Icon: Leaf },
  { number: '02', title: 'Orchard', detail: 'Collection into bins and crates', Icon: Tractor },
  { number: '03', title: 'Road', detail: 'Movement over farm roads', Icon: Truck },
  { number: '04', title: 'Packhouse', detail: 'Reception, sorting and transfer', Icon: Factory },
  { number: '05', title: 'Cold storage', detail: 'Staging and movement', Icon: Snowflake },
  { number: '06', title: 'Transport', detail: 'Loading and onward shipment', Icon: Truck },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="ClevaCado home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <img src="/branding/clevacado-mark.png" alt="" />
      <span><strong>Cleva<span>Cado</span></strong><small>Post-harvest diagnostics</small></span>
    </a>
  );
}

function JourneyFilm() {
  return (
    <figure className="journey-film">
      <video
        className="journey-film-player"
        autoPlay
        muted
        controls
        playsInline
        preload="metadata"
        aria-label="40-second illustrative animation of avocados moving through handling"
        onPlay={() => track('video_play', { name: 'journey-film' })}
      >
        <source src="/media/clevacado-journey-film.mp4" type="video/mp4" />
        Your browser does not support HTML video.
      </video>
    </figure>
  );
}

type AnimationKind = 'prototype' | 'village';

function PresentationAnimation({ kind, className = '' }: { kind: AnimationKind; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '200px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const title = kind === 'prototype' ? 'Illustrative 3D prototype assembly animation' : 'Illustrative future supply-chain island animation';
  return <div className={`presentation-animation ${className}`} ref={container}>
    {visible ? <iframe title={title} src={`/presentation-v2/index.html?embed=${kind}#${kind === 'village' ? 'future' : 'hello'}`} loading="lazy" /> : <div className="presentation-animation-placeholder" aria-label={title} />}
  </div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'preview' | 'error' | 'drafted' | 'draft-sending'>('idle');
  const draftSaved = useRef(false);
  const draftRequest = useRef<Promise<void> | null>(null);

  useEffect(() => { trackOnce('page-view', 'page_view'); }, []);

  const openPilot = () => {
    track('pilot_form_open');
    setMenuOpen(false);
    document.getElementById('pilot')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => document.getElementById('email')?.focus({ preventScroll: true }), 450);
  };

  const closeMenu = () => setMenuOpen(false);
  const saveEarlyEnquiry = async (event: FocusEvent<HTMLInputElement>) => {
    const email = event.currentTarget;
    const form = email.form;
    if (!form || !email.validity.valid || !email.value || draftSaved.current) return;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setFormStatus('preview');
      return;
    }
    if (draftRequest.current) return draftRequest.current;

    const earlyValues = new FormData(form);
    earlyValues.set('submission-stage', 'Early follow-up after valid email entry');
    earlyValues.set('subject', 'New ClevaCado early follow-up');
    track('pilot_form_draft');
    setFormStatus('draft-sending');
    draftRequest.current = (async () => {
      try {
        const encodedValues = new URLSearchParams();
        earlyValues.forEach((value, key) => {
          if (typeof value === 'string') encodedValues.append(key, value);
        });
        const response = await fetch('/__forms.html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encodedValues.toString(),
        });
        if (!response.ok) throw new Error(`Early enquiry failed (${response.status})`);
        draftSaved.current = true;
        setFormStatus('drafted');
      } catch {
        setFormStatus('error');
      } finally {
        draftRequest.current = null;
      }
    })();
    return draftRequest.current;
  };

  const prepareEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (draftRequest.current) await draftRequest.current;
    const values = new FormData(form);
    values.set('submission-stage', 'Completed enquiry');
    values.set('subject', 'New ClevaCado website enquiry');
    track('pilot_form_submit');

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setFormStatus('preview');
      return;
    }

    setFormStatus('sending');
    try {
      const encodedValues = new URLSearchParams();
      values.forEach((value, key) => {
        if (typeof value === 'string') encodedValues.append(key, value);
      });
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedValues.toString(),
      });
      if (!response.ok) throw new Error(`Form submission failed (${response.status})`);
      setFormStatus('sent');
      draftSaved.current = false;
      form.reset();
    } catch {
      setFormStatus('error');
    }
  };
  const navTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <div className="nav-inner">
          <Brand />
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav id="primary-navigation" className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Main navigation">
            <a href="#product" onClick={navTo('product')}>The device</a>
            <a href="#journey" onClick={navTo('journey')}>The journey</a>
            <a href="#about" onClick={navTo('about')}>About us</a>
            <a className="nav-presentation" href="/presentation">Presentation <ArrowUpRight size={14} /></a>
            <button className="nav-cta" type="button" onClick={openPilot}>Discuss a pilot <ArrowUpRight size={15} /></button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-mark" /> Engineering better avocado handling</p>
            <h1 id="hero-heading">See what your avocados experience <em>along the journey.</em></h1>
            <p className="hero-lede">We’re developing an avocado-shaped sensing device to record motion during handling and help investigate where rough events may happen.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={openPilot}>Discuss a field pilot <ArrowRight size={17} /></button>
              <a className="button button-secondary" href="#product" onClick={navTo('product')}>See how it works <ArrowDown size={16} /></a>
            </div>
            <p className="hero-note"><Check size={15} /> Prototype development and controlled testing underway</p>
          </div>
          <div className="hero-visual" aria-label="ClevaCado journey film and prototype animation">
            <JourneyFilm />
            <div className="hero-prototype">
              <div className="hero-prototype-heading"><span>MEET THE PROTOTYPE</span><small>Illustrative assembly</small></div>
              <PresentationAnimation kind="prototype" className="hero-prototype-animation" />
            </div>
          </div>
          <a className="hero-scroll" href="#problem" onClick={navTo('problem')} aria-label="Scroll to the problem"><span>01 / 06</span><ArrowDown size={15} /></a>
        </section>

        <section className="problem-section section-pad" id="problem" aria-labelledby="problem-heading">
          <div className="section-intro">
            <p className="section-kicker">The information gap</p>
            <h2 id="problem-heading">You can see a bruised avocado. <em>Can you see what happened?</em></h2>
            <p>Quality issues can become visible after harvest, handling or transport. By then, the events along the way may be difficult to pinpoint.</p>
          </div>
          <div className="problem-compare">
            <article className="compare-item compare-inspection">
              <span className="compare-number">01</span>
              <div className="inspection-fruit" aria-hidden="true"><span /><i /></div>
              <div><h3>Inspect the fruit</h3><p>Inspection can reveal a quality issue, but not necessarily the handling history that came before it.</p></div>
            </article>
            <div className="compare-connector" aria-hidden="true"><ArrowRight /></div>
            <article className="compare-item compare-recording">
              <span className="compare-number">02</span>
              <div className="motion-mark" aria-hidden="true"><Waves /><span /></div>
              <div><h3>Record the journey</h3><p>A sensor alongside the fruit can add motion measurements for a later investigation.</p></div>
            </article>
          </div>
          <p className="section-caveat">Motion records can help frame an investigation; they do not, by themselves, prove that a fruit was bruised or identify its cause.</p>
        </section>

        <section className="product-section section-pad" id="product" aria-labelledby="product-heading">
          <div className="product-heading">
            <div><p className="section-kicker">The device</p><h2 id="product-heading">An avocado with something <em>clever inside.</em></h2></div>
            <p>Designed to travel through a suitable handling trial alongside the crop—recording motion for careful review afterwards.</p>
          </div>
          <div className="product-grid">
            <figure className="product-detail-image">
              <PresentationAnimation kind="prototype" className="product-prototype-animation" />
              <figcaption><span>Inside the prototype</span><span>Illustrative assembly • component layout may change</span></figcaption>
            </figure>
            <div className="how-steps">
              <article><span>01</span><div><h3>Place</h3><p>Position the prototype in a suitable test environment alongside avocados being handled.</p></div></article>
              <article><span>02</span><div><h3>Record</h3><p>The current prototype uses an H3LIS331DL high-g accelerometer to record motion.</p></div></article>
              <article><span>03</span><div><h3>Investigate</h3><p>Review recorded events and compare them with handling-stage notes when those are available.</p></div></article>
              <div className="tech-note"><span className="tech-dot" /><p><strong>Built for investigation.</strong> Controlled recordings and offline analysis are in development. Field performance and bruising outcomes still need validation.</p></div>
            </div>
          </div>
        </section>

        <section className="journey-section section-pad" id="journey" aria-labelledby="journey-heading">
          <div className="journey-heading">
            <div><p className="section-kicker">One connected route</p><h2 id="journey-heading">Follow the fruit. <em>Review the motion.</em></h2></div>
            <p>Each transfer is part of the story. A trial can help us ask where motion events occurred and what was happening at the time.</p>
          </div>
          <figure className="journey-island">
            <PresentationAnimation kind="village" className="journey-island-animation" />
            <figcaption>Illustrative future concept · signals are not live telemetry</figcaption>
          </figure>
          <ol className="journey-stages">
            {journeyStages.map(({ number, title, detail, Icon }) => <li key={number}><span className="stage-icon"><Icon size={19} strokeWidth={1.8} /></span><span className="stage-number">{number}</span><strong>{title}</strong><small>{detail}</small></li>)}
          </ol>
          <p className="journey-footnote"><CircleHelp size={15} /> This route is illustrative. Cold storage is shown as a handling stage, not as a source of damage.</p>
        </section>

        <section className="evidence-section about-evidence section-pad" id="about" aria-labelledby="evidence-heading">
          <div className="evidence-heading"><p className="section-kicker">Where the work stands</p><h2 id="evidence-heading">Real engineering. <em>Careful next steps.</em></h2><p>We’re building from prototype recordings and controlled experiments toward validation in real handling environments.</p></div>
          <div className="evidence-content">
            <ol className="progress-list">
              <li className="progress-done"><span className="progress-mark"><Check size={15} /></span><div><strong>Prototype sensing</strong><p>Motion sensors and data capture have been exercised in controlled tests.</p></div><small>Under development</small></li>
              <li className="progress-done"><span className="progress-mark"><Check size={15} /></span><div><strong>Controlled recordings</strong><p>Recorded motion is being reviewed and used in ongoing event-analysis work.</p></div><small>Research in progress</small></li>
              <li className="progress-next"><span className="progress-mark"><ArrowRight size={15} /></span><div><strong>Our next goal: run an initial field pilot</strong><p>Connect with a real avocado farm, packhouse and courier, then deploy the prototype on an initial pilot run.</p></div><small>Next goal</small></li>
            </ol>
            <aside className="observation-card" aria-label="Illustrative event review example">
              <div className="observation-top"><span className="observation-led" /> Example of an event review <span>Illustrative</span></div>
              <div className="observation-body"><small>What a trial could help us review</small><h3>Motion event recorded</h3><div className="observation-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><dl><div><dt>Handling stage</dt><dd>Compare with trial notes</dd></div><div><dt>Next step</dt><dd>Review the event context</dd></div></dl></div>
              <p className="observation-caveat">A motion signal is not a bruise measurement or proof of damage.</p>
            </aside>
          </div>
          <div className="about-heading about-heading-compact">
            <p className="section-kicker">About ClevaCado</p>
            <h3>A student-built idea, <em>moving toward the field.</em></h3>
            <p>ClevaCado is an early-stage project exploring whether motion records can help avocado growers and packhouses investigate handling. We’re developing the device and analysis together, with field validation still ahead.</p>
          </div>
          <figure className="company-timeline">
            <img src="/images/clevacado-company-journey.svg" alt="ClevaCado company timeline from the start of the journey in January 2026 through grower outreach, university and regional competition rounds, mentorship, strategic conversations, AfreTec, the EIE Open Day, and a future field pilot." loading="lazy" />
            <figcaption>Our journey so far. A field pilot is the next chapter, not a completed deployment.</figcaption>
          </figure>
          <div className="founder-grid" aria-label="ClevaCado founders">
            <article className="founder-card">
              <p className="section-kicker">Co-founder · Technical development</p>
              <h3>Dylan Walt</h3>
              <p>Dylan is an Electrical and Information Engineering student at the University of the Witwatersrand. His ClevaCado work focuses on classifier development and evaluating ways to interpret recorded motion events.</p>
            </article>
            <article className="founder-card">
              <p className="section-kicker">Co-founder · Prototype and data</p>
              <h3>Dylan Simpson</h3>
              <p>Dylan is an Electrical and Information Engineering student at the University of the Witwatersrand. His ClevaCado work focuses on prototype logging, data handling and supporting repeatable test work.</p>
            </article>
          </div>
          <div className="contact-grid" aria-label="Contact the founders">
            <article className="contact-card">
              <span className="contact-label">Co-founder · Technical development</span>
              <strong>Dylan Walt</strong>
              <span className="contact-number">071 929 0175</span>
              <span className="contact-actions"><a href="tel:+27719290175">Call</a><a href="https://wa.me/27719290175" target="_blank" rel="noreferrer">WhatsApp</a></span>
            </article>
            <article className="contact-card">
              <span className="contact-label">Co-founder · Prototype and data</span>
              <strong>Dylan Simpson</strong>
              <span className="contact-number">076 542 2426</span>
              <span className="contact-actions"><a href="tel:+27765422426">Call</a><a href="https://wa.me/27765422426" target="_blank" rel="noreferrer">WhatsApp</a></span>
            </article>
          </div>
          <section className="social-proof" aria-labelledby="social-proof-heading">
            <div className="social-proof-heading">
              <p className="section-kicker">From our LinkedIn</p>
              <h3 id="social-proof-heading">A few moments from the journey.</h3>
            </div>
            <div className="social-links">
              <a href="https://www.linkedin.com/posts/dylanwalt_entrepreneurship-agtech-machinelearning-activity-7477315277190447104-nZjI" target="_blank" rel="noreferrer"><span>EDHE · ClevaCado launch</span><small>Our first EDHE Absa InnoVarsity milestone <ArrowUpRight size={14} /></small></a>
              <a href="https://za.linkedin.com/in/dylanwalt" target="_blank" rel="noreferrer"><span>EDHE · Inter-varsity regionals</span><small>Representing Wits with ClevaCado <ArrowUpRight size={14} /></small></a>
              <a href="https://za.linkedin.com/in/dylanwalt" target="_blank" rel="noreferrer"><span>AfreTec 2026 · Wits</span><small>Read Dylan’s AfreTec update <ArrowUpRight size={14} /></small></a>
            </div>
            <a className="dsl-project-link" href="https://dsllab.app/projects/group-03/" target="_blank" rel="noreferrer">
              <span><strong>Digital Smart Lab · Group 03</strong><small>Read the public project page and investigation overview.</small></span>
              <ArrowUpRight size={17} />
            </a>
          </section>
        </section>

        <section className="pilot-section section-pad" id="pilot" aria-labelledby="pilot-heading">
          <div className="pilot-copy"><p className="section-kicker">Work with us</p><h2 id="pilot-heading">Help us take ClevaCado <em>into the field.</em></h2><p>We’re looking to speak with growers and packhouses interested in exploring how handling events can be measured in real operating environments. Avocados are our starting point; other produce is a future research question.</p><a className="email-link" href="mailto:hello@clevacado.co.za">hello@clevacado.co.za <ArrowUpRight size={16} /></a><p className="privacy-note">Only your email address is required. When you leave the email field with a valid address, the email and any details entered so far are sent to ClevaCado so we can follow up, even if you do not press Send. Press Send enquiry to share later changes. Your information is not sent while you type.</p></div>
          <form className="pilot-form" name="field-enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={prepareEnquiry}>
            <input type="hidden" name="form-name" value="field-enquiry" />
            <input type="hidden" name="subject" value="New ClevaCado website enquiry" />
            <input type="hidden" name="submission-stage" value="Completed enquiry" />
            <p className="honeypot"><label>Leave this field empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
            <label htmlFor="name">Your name <span>Optional</span></label><input id="name" name="name" type="text" autoComplete="name" />
            <label htmlFor="email">Email address <span>Required</span></label><input id="email" name="email" type="email" autoComplete="email" required onBlur={saveEarlyEnquiry} />
            <label htmlFor="organisation">Farm or organisation <span>Optional</span></label><input id="organisation" name="organisation" type="text" autoComplete="organization" />
            <label htmlFor="message">What would you like to investigate? <span>Optional</span></label><textarea id="message" name="message" rows={3} />
            <button className="button button-primary form-submit" type="submit" disabled={formStatus === 'sending'}>{formStatus === 'sending' ? 'Sending…' : 'Send enquiry'} <ArrowRight size={17} /></button>
            <p className={`form-note form-status-${formStatus}`} role="status" aria-live="polite">{formStatus === 'sent' ? 'Thanks — your enquiry was received by ClevaCado.' : formStatus === 'drafted' ? 'We received your email and the details entered so far. Press Send enquiry to share any changes.' : formStatus === 'draft-sending' ? 'Sending your email and the details entered so far to ClevaCado…' : formStatus === 'preview' ? 'Local preview: your details were not sent. Email delivery is not active in localhost.' : formStatus === 'error' ? 'We couldn’t send this just now. Please email hello@clevacado.co.za directly.' : formStatus === 'sending' ? 'Sending your enquiry securely…' : 'This is an invitation to talk, not a commitment to a pilot.'}</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <Brand />
        <p>Measuring motion. Investigating handling.</p>
        <button className="footer-analytics" type="button" onClick={() => setAnalyticsOpen(true)}>Private analytics <LockKeyhole size={13} /></button>
      </footer>
      <AnalyticsDashboard isOpen={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />
    </div>
  );
}
