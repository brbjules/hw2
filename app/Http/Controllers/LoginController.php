<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Session;
use App\Models\Appuser;

class LoginController extends BaseController
{
    public function login(Request $request)
    {
        if (session('user_id'))
            return redirect('home');
        $error = session('error');
        Session::forget('error');
        if ($request->required)
            $error = 'required';
        return view('login')->with('error', $error);
    }

    public function auth_page(Request $request)
    {
        if (session('user_id'))
            return redirect('home');

        if (!empty($request->logname) && !empty($request->logpw))
        {
            $user = Appuser::where('username', $request->logname)->first();
            if ($user && password_verify($request->logpw, $user->user_pw))
            {
                session(['user_id' => $user->id, 'username' => $user->username]);
                return redirect('home');
            }
            else
            {
                session(['error' => 'wrong']);
                return redirect('login')->withInput();
            }
        }
        else if (!empty($request->logname) || !empty($request->logpw))
        {
            session(['error' => 'empty_fields_login']);
            return redirect('login')->withInput();
        }
        if (!empty($request->regname) && !empty($request->regmail) && !empty($request->regpw) && !empty($request->regconfirm))
        {
            if (strlen($request->regname) == 0 || strlen($request->regmail) == 0 || strlen($request->regpw) == 0 || strlen($request->regconfirm) == 0) 
            {
                session(['error' => 'empty_fields']);
                return redirect('login')->withInput();
            } 
            else if (strlen($request->regpw) < 8)
            {
                session(['error' => 'short_password']);
                return redirect('login')->withInput();
            }
            else if ($request->regpw != $request->regconfirm)
            {
                session(['error' => 'bad_passwords']);
                return redirect('login')->withInput();
            }
            else if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $request->regname))
            {
                session(['error' => 'bad_username']);
                return redirect('login')->withInput();
            }
            else if (Appuser::where('username', $request->regname)->first())
            {
                session(['error' => 'existing_name']);
                return redirect('login')->withInput();
            }
            else if (Appuser::where('email', $request->regmail)->first())
            {
                session(['error' => 'existing_email']);
                return redirect('login')->withInput();
            }

            $user = new Appuser;
            $user->username = $request->regname;
            $user->email = $request->regmail;
            $user->user_pw = password_hash($request->regpw, PASSWORD_BCRYPT);
            $user->join_date = date("Y-m-d");
            $user->save();

            session(['user_id' => $user->id, 'username' => $user->username]);
            return redirect('home');
        }
    }

    public function check_if_taken($type, $value)
    {
        if (empty($value) || ($type != 'username' && $type != 'email'))
            return null;
        $exists = (Appuser::where($type, $value)->first()) ? true : false;
        return array('type' => $type, 'exists' => $exists);
    }
    
    public function logout()
    {
        session()->flush();
        return redirect('home');
    }
}