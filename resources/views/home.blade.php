<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LogoSito</title>
    <link rel="stylesheet" href="{{ url('main.css') }}" />
    <link rel="stylesheet" href="{{ url('misc.css') }}" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <script> const BASE_URL = "{{ url('/') }}"; </script>
    <script src="{{ url('js/main.js') }}" defer></script>
    <script src="{{ url('js/index.js') }}" defer></script>
    <script src="{{ url('js/api.js') }}" defer></script>
  </head>
  <body>
    <header>
      <a href="{{ url('home') }}" id="logo"><img src="{{ url('assets/logo.png') }}"></a>
      <nav>
        <a href="#" data-current="1">top</a>
        <a href="#" data-current="0">new</a>
        <a href="#" data-current="0">controversial</a>
        <a href="#" data-current="0">old</a>
      </nav>
      <div>
        @if (session('username'))
        <a id="current-user" href="{{ url('profile/'.session('username')) }}">{{ session('username') }}</a> | <a href="{{ url('logout') }}">logout</a>
        @else
        Want to join? <a href="{{ url('login') }}">Log in</a> or <a href="{{ url('login') }}">sign up</a> in seconds.
        @endif
      </div>
    </header>
    <div class="main">
    <section>
      <div id="jotd">
        <div>Dad Joke Of The Day:</div>
	      <p></p>
      </div>
      <div class="all-entries"></div>
    </section>
    <div class="side">
      <form id="search" name="sitesearch" method="post">
        @csrf
        <input type="text" id="searchbar" name="bar" placeholder="search here">
        <input type="submit" value="">
      </form>
      @if (!session('username'))
      <form id="homelogin" method="post">
        @csrf
        <input type="text" name="logname" placeholder="username">
        <input type="password" name="logpw" placeholder="password">
        <div>
          <span>
            <input id="rem-login" type="checkbox" name="rem">
            <label for="rem-login">remember me</label>
            <a href="#">reset password</a>
          </span>
          <button type="submit">login</button>
        </div>
      </form>
      @endif
      <a class="submit-new" href="{{ url('submit') }}">Submit a new link</a>
      <a class="submit-new" href="{{ url('submit?new=text') }}">Submit a new text post</a>
      <div id="holidays" class="whitediv"><h2>Holidays in the world:</h2></div>
    </div>
    </div>
    <footer>
      <div id="footer-menu">
        <div class="col firstcol">
          <span>about</span><br>
          <a href="#">blog</a><br>
          <a href="#">about</a><br>
          <a href="#">advertising</a>
        </div>
        <div class="col">
          <span>help</span><br>
          <a href="#">help</a><br>
          <a href="#">FAQ</a><br>
          <a href="#">mod guidelines</a><br>
          <a href="#">contact us</a>
        </div>
        <div class="col">
          <span>tools</span><br>
          <a href="#">mobile app</a><br>
          <a href="#">source code</a><br>
          <a href="#">rss feed</a>
        </div>
      </div>
      <p>Vitae eligendi nobis consequuntur unde incidunt ratione ad. Consectetur esse sunt autem temporibus. © 2025 Aut at eos soluta.<br>Aperiam odio sed sit expedita.</p>
    </footer>
  </body>
</html>