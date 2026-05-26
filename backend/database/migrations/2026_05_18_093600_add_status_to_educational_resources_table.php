<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('educational_resources', function (Blueprint $table) {
            $table->enum('status', ['pending', 'published', 'rejected'])->default('pending')->after('resource_type');
        });
    }

    public function down(): void
    {
        Schema::table('educational_resources', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
