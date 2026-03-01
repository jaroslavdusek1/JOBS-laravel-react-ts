<?php

use Illuminate\Support\Facades\Route;

// Load routes from multiple files
require base_path('routes/api/auth.php');
require base_path('routes/api/jobs.php');
require base_path('routes/api/users.php');
