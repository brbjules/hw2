<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $prof->username }}'s profile - LogoSito</title>
    <link rel="stylesheet" href="{{ url('main.css') }}" />
    <link rel="stylesheet" href="{{ url('profile.css') }}" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <script>
      const BASE_URL = "{{ url('/') }}";
      function giveToken() {
        return '{{ csrf_token() }}';
      }
    </script>
    <script src="{{ url('js/main.js') }}" defer></script>
    <script src="{{ url('js/profile.js') }}" defer></script>
  </head>
  <body>
    <header>
      <a href="{{ url('home') }}" id="logo"><img src="{{ url('assets/logo.png') }}"></a>
      <span>{{ $prof->username }}</span>
      <nav>
        <a href="#" data-current="1">overview</a>
        <a href="#" data-current="0">comments</a>
        <a href="#" data-current="0">posts</a>
        @if (session('username') && session('username') == $prof->username)
        <a href='#' data-current='0'>saved</a>
        <a href='#' data-current='0'>wiki</a>
        @endif
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
        <div class="top-menu">
          <span class="menu-margin">sorted by:</span>
          <div class="dropdown">
            <span>new</span><img src="{{ url('assets/arrowsort.png') }}">
          </div>
          <div class="drop-choices hidden">
            <a href="#">top</a>
            <a href="#">new</a>
            <a href="#">controversial</a>
            <a href="#">old</a>
          </div>
        </div>
        <div class="hidden">
          <div class="wiki-section">
            <div class="wiki-parent">
              <input type="text" placeholder="search on Wikipedia">
              <div class="wiki-results"></div>
            </div>
            <div class="wiki-list"></div>
          </div>
        </div>
        <div class="all-entries"></div>
      </section>
      <div class="side">
        <h2>{{ $prof->username }}</h2>
        <div class='desc'>{{ $prof->user_desc }}</div>
        @if (session('username') && session('username') == $prof->username)
        <a><img src="{{ url('assets/penciladd.png') }}"><span>add description</span></a>
        @endif
        <p><span>{{ $prof->post_points }}</span> post points</p>
        <p><span>{{ $prof->comment_points }}</span> comment points</p>
        <div class="joined">Joined on {{ $prof->join_date }}</div>
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