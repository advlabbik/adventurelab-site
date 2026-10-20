/* Il cancello dopo la seconda cosa.
   Chi compila il modulo manda email, ente, ruolo e territorio al worker
   adventurelab-lead (stesso servizio delle candidature, con source "guida"):
   il contatto va su Brevo, lista 40, senza avviso a collab@. Poi si apre il
   resto della guida qui sulla pagina, e il browser se lo ricorda. */
(function(){
  var KEY='al-guida-territori';
  var ENDPOINT='https://adventurelab-lead.account-fe1.workers.dev';
  var form=document.getElementById('modulo-guida');
  var grazie=document.getElementById('grazie');
  var errore=document.getElementById('errore-guida');
  var dopo=document.getElementById('dopo-cancello');
  if(!form)return;
  var btn=form.querySelector('button[type=submit]');
  var widget=form.querySelector('.cf-turnstile');

  function apri(scorri){
    document.documentElement.classList.remove('chiusa');
    try{localStorage.setItem(KEY,'aperta')}catch(_){}
    if(scorri){
      var tre=document.getElementById('esistente');
      if(tre)tre.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  if(!document.documentElement.classList.contains('chiusa')){
    form.hidden=true;grazie.hidden=false;
    return;
  }

  /* Turnstile si carica solo quando il modulo si avvicina o si tocca un campo:
     caricato subito rallenterebbe la pagina a chi non arriva fin qui. */
  var tsCaricato=false;
  function caricaTurnstile(){
    if(tsCaricato||!widget)return;
    tsCaricato=true;
    var s=document.createElement('script');
    s.src='https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async=true;s.defer=true;
    document.head.appendChild(s);
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries,io){
      if(entries.some(function(e){return e.isIntersecting})){io.disconnect();caricaTurnstile()}
    },{rootMargin:'600px 0px'}).observe(form);
  }else caricaTurnstile();
  form.addEventListener('focusin',caricaTurnstile,{once:true});

  function token(){
    var i=form.querySelector('[name="cf-turnstile-response"]');
    return i?i.value:'';
  }
  function attendiToken(ms){
    return new Promise(function(ok){
      if(!widget)return ok('');
      var t0=Date.now();
      (function giro(){
        var v=token();
        if(v||Date.now()-t0>ms)return ok(v);
        setTimeout(giro,150);
      })();
    });
  }
  function nuovoToken(){
    try{if(window.turnstile&&widget)window.turnstile.reset(widget)}catch(_){}
  }
  function mostraErrore(msg){
    errore.textContent=msg;errore.hidden=false;
    btn.disabled=false;btn.textContent=btn.dataset.label;
  }

  function invia(dati,tok){
    dati.turnstileToken=tok;
    return fetch(ENDPOINT,{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(dati)
    }).then(function(r){
      return r.json().catch(function(){return{ok:false,error:'http_'+r.status}});
    },function(){return{ok:false,error:'network'}});
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(btn.disabled)return;
    errore.hidden=true;
    var primo=null;
    Array.prototype.forEach.call(form.elements,function(el){
      if(!el.name||el.name==='website'||el.name==='cf-turnstile-response')return;
      var ok=el.type==='checkbox'?el.checked:el.checkValidity();
      el.setAttribute('aria-invalid',ok?'false':'true');
      if(!ok&&!primo)primo=el;
    });
    if(primo){primo.focus();if(primo.reportValidity)primo.reportValidity();return}

    caricaTurnstile();
    btn.disabled=true;btn.textContent=btn.dataset.sending;
    var d=new FormData(form);
    var dati={
      source:'guida',
      type:'territorio',
      email:String(d.get('email')||'').trim(),
      org:String(d.get('ente')||'').trim(),
      role:String(d.get('ruolo')||'').trim(),
      territory:String(d.get('territorio')||'').trim(),
      page:location.pathname,
      consent:true,
      optin:true,
      lang:'it',
      website:String(d.get('website')||'')
    };

    attendiToken(5000).then(function(tok){
      return invia(dati,tok).then(function(res){
        /* Token scaduto o già usato: se ne chiede un altro e si riprova una volta. */
        if(!res.ok&&res.error==='turnstile_failed'){
          nuovoToken();
          return new Promise(function(ok){setTimeout(ok,400)})
            .then(function(){return attendiToken(5000)})
            .then(function(t2){return invia(dati,t2)});
        }
        return res;
      });
    }).then(function(res){
      if(res.ok){
        form.hidden=true;grazie.hidden=false;
        apri(true);
        return;
      }
      nuovoToken();
      if(res.error==='invalid_email')return mostraErrore('Controllate l’indirizzo email, sembra incompleto.');
      if(res.error==='consent_required')return mostraErrore('Per continuare serve il consenso qui sopra.');
      if(res.error==='rate_limited')return mostraErrore('Troppi invii in poco tempo. Riprovate fra un minuto.');
      /* Qualsiasi altro guasto è nostro, non loro: la guida si apre lo stesso. */
      console.warn('[guida]',res.error);
      form.hidden=true;grazie.hidden=false;
      apri(true);
    });
  });

  /* Chi arriva da un link diretto a un capitolo chiuso viene portato al cancello. */
  if(location.hash&&dopo&&dopo.querySelector(location.hash)){
    var c=document.getElementById('le-altre-cinque');
    if(c)setTimeout(function(){c.scrollIntoView({block:'start'})},50);
  }
})();
