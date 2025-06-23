<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Log in - LogoSito</title>
    <link rel="stylesheet" href="{{ url('main.css') }}" />
    <link rel="stylesheet" href="{{ url('misc.css') }}" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <script> const BASE_URL = "{{ url('/') }}"; </script>
    <script src="{{ url('js/login.js') }}" defer></script>
  </head>
  <body>
    <header>
      <a href="{{ url('home') }}" id="logo"><img src="{{ url('assets/logo.png') }}"></a>
      <nav>
        <a href="{{ url('home') }}">back to home</a>
      </nav>
    </header>
    <div class="main">
      <div class="sign-up">
        <h1>Log in</h1>
        <p>
          By continuing, you agree to our
          <a href="#">User Agreement</a> and 
          <a href="#">Privacy Policy</a>.
        </p>
        @if ($error == 'empty_fields')
        <div class="error">Please fill out all the required fields.</div>
        @elseif ($error == 'wrong')
        <div class="error">Incorrect username or password. Please try again.</div>
        @elseif ($error == 'required')
        <div class="error">You must be logged in to perform this action.</div>
        @elseif ($error == 'empty_fields_login')
        <div class="error">Please insert username and password.</div>
        @elseif ($error == 'short_password')
        <div class="error">Your password is too short.</div>
        @elseif ($error == 'bad_passwords')
        <div class="error">The passwords do not match.</div>
        @elseif ($error == 'bad_username')
        <div class="error">The username you entered is invalid.</div>
        @elseif ($error == 'existing_name')
        <div class="error">The username you entered is already in use.</div>
        @elseif ($error == 'existing_email')
        <div class="error">The email address you entered is already in use.</div>
        @else
        <div class="error hidden"></div>
        @endif
        <div>
          <form id="login" name="login" method="post">
            @csrf
            <div class="inputparent">
              <label for="logname">Username</label>
              <input type="text" name="logname" id="logname" value='{{ old("logname") }}'>
            </div>
            <div class="inputparent">
              <label for="logpw">Password</label>
              <input type="password" name="logpw" id="logpw">
            </div>
            <span class="rem-reset">
              <div>
                <input id="rem-login" type="checkbox" name="rem">
                <label for="rem-login">Remember me</label>
              </div>
              <a href="#">reset password</a>
            </span>
            <button type="submit">Log in</button>
          </form>
        </div>
        <div class="hidden">
          <form id="signup" name="signup" method="post">
            @csrf
            <div class="inputparent">
              <label for="regname">Username</label>
              <input type="text" name="regname" id="regname">
            </div>
            <div class="inputparent">
              <label for="regmail">E-mail</label>
              <input type="text" name="regmail" id="regmail">
            </div>
            <div class="inputparent">
              <label for="regpw">Password</label>
              <input type="password" name="regpw" id="regpw">
            </div>
            <div class="strength" data-strength-val="0">
              <p></p>
              <div><div class="bar"></div></div>
            </div>
            <div class="inputparent">
              <label for="regconfirm">Confirm password</label>
              <input type="password" name="regconfirm" id="regconfirm">
            </div>
            <button type="submit">Sign up</button>
          </form>
        </div>
        <div class="noacc">
          Don't have an account? 
          <a href="#">SIGN UP</a>
        </div>
        <div class="goback hidden">
          <a href="#"><img src="{{ url('assets/returnarrow.png') }}"> Go back</a>
        </div>
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