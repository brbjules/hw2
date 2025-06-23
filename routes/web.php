<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('home');
});

Route::get('login', 'App\Http\Controllers\LoginController@login');
Route::post('login', 'App\Http\Controllers\LoginController@auth_page');
Route::get('logout', 'App\Http\Controllers\LoginController@logout');
Route::get('check_signup/{type}/{value}', 'App\Http\Controllers\LoginController@check_if_taken');

Route::get('home', 'App\Http\Controllers\MainController@homepage');
Route::post('home', 'App\Http\Controllers\LoginController@auth_page');
Route::get('homeposts/{sort?}/', 'App\Http\Controllers\MainController@load_home');

Route::get('submit', 'App\Http\Controllers\MainController@go_submit');
Route::post('submit', 'App\Http\Controllers\MainController@submit_post');

Route::get('post/{id}/', 'App\Http\Controllers\MainController@open_post');
Route::post('post/{id}/', 'App\Http\Controllers\LoginController@auth_page');
Route::get('post/{id}/comments/{sort?}/', 'App\Http\Controllers\MainController@load_comments');
Route::post('reply', 'App\Http\Controllers\MainController@add_comment');

Route::get('profile/{user}/', 'App\Http\Controllers\MainController@open_profile');
Route::get('load/profile/{user}/{option?}/{sort?}', 'App\Http\Controllers\MainController@get_profile');
Route::get('load/saves/{sort?}', 'App\Http\Controllers\MainController@get_saves');
Route::post('descedit', 'App\Http\Controllers\UserController@send_desc');

Route::get('vote/{type}/{entry}/{id}', 'App\Http\Controllers\UserController@vote');
Route::get('save/{entry}/{id}/{remove?}', 'App\Http\Controllers\UserController@save');
Route::get('wiki', 'App\Http\Controllers\UserController@save_wiki_article');