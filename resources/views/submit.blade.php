<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Submit a post - LogoSito</title>
    <link rel="stylesheet" href="{{ url('main.css') }}" />
    <link rel="stylesheet" href="{{ url('submit.css') }}" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <script>
      @if ($new == 'text')
      let textPostRedirect = true;
      @else
      let textPostRedirect = false;
      @endif
    </script>
    <script src="{{ url('js/submit.js') }}" defer></script>
  </head>
  <body>
    <header>
      <a href="{{ url('home') }}" id="logo"><img src="{{ url('assets/logo.png') }}"></a>
      <span>submit</span>
    </header>
    <div class="shrink">
      <h1>submit a post</h1>
      <div class="choice">
        <div class="leftmargin">
          <a href="#" data-select="1" id="linkchoice">link</a>
          <a href="#" data-select="0" id="textchoice">text</a>
        </div>
        <div class="bar"></div>
      </div>
      <div class="note">
        You are submitting a link. The key to a successful submission is interesting content and a descriptive title.
      </div>
      <div class="note hidden">
        You are submitting a text-based post. Speak your mind. A title is required, but expanding further in the text field is not. Beginning your title with "vote up if" is violation of intergalactic law.
      </div>
      <div class="error hidden"></div>
      <div>
        <form name="link" method="post">
          @csrf
          <section>
            <div><strong class="red">*</strong>url</div>
            <input type="text" id="linkurl" name="linkurl">
          </section>
          <section class="textsec">
            <div>
              <span class="text-title"><strong class="red">*</strong>title</span>
              <span class="count" data-val="0">0/300</span>
            </div>
            <textarea id="linktitle" name="linktitle"></textarea>
          </section>
          <div class="reminder">
            please be mindful of our <a href="#">content policy</a> and practice <a href="#">good etiquette</a>.
          </div>
          <p>*required</p>
          <button type="submit">submit</button>
        </form>
      </div>
      <div class="hidden">
        <form name="text" method="post">
          @csrf
          <section>
            <div>url</div>
            <input type="text" id="texturl" name="texturl">
          </section>
          <section class="textsec">
            <div>
              <span class="text-title"><strong class="red">*</strong>title</span>
              <span class="count" data-val="0">0/300</span>
            </div>
            <textarea id="posttitle" name="posttitle"></textarea>
          </section>
          <section class="textsec">
            <div>
              <span class="text-title">description</span>
              <span class="count" data-val="0">0/2000</span>
            </div>
            <textarea id="desc" name="desc"></textarea>
          </section>
          <div class="reminder">
            please be mindful of our <a href="#">content policy</a> and practice <a href="#">good etiquette</a>.
          </div>
          <p>*required</p>
          <button type="submit">submit</button>
        </form>
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