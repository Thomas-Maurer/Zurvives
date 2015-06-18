# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150618064809) do

  create_table "character_equipements", force: :cascade do |t|
    t.integer "character_id",  limit: 4
    t.integer "equipement_id", limit: 4
  end

  add_index "character_equipements", ["character_id"], name: "index_character_equipements_on_character_id", using: :btree
  add_index "character_equipements", ["equipement_id"], name: "index_character_equipements_on_equipement_id", using: :btree

  create_table "character_skills", force: :cascade do |t|
    t.integer "character_id", limit: 4
    t.integer "skill_id",     limit: 4
  end

  add_index "character_skills", ["character_id"], name: "index_character_skills_on_character_id", using: :btree
  add_index "character_skills", ["skill_id"], name: "index_character_skills_on_skill_id", using: :btree

  create_table "characters", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.integer  "user_id",    limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "characters", ["user_id"], name: "index_characters_on_user_id", using: :btree

  create_table "equipments", force: :cascade do |t|
    t.string   "name",               limit: 255
    t.text     "description",        limit: 65535
    t.string   "image",              limit: 255
    t.integer  "actable_id",         limit: 4
    t.string   "actable_type",       limit: 255
    t.integer  "special_ability_id", limit: 4
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  add_index "equipments", ["special_ability_id"], name: "index_equipments_on_special_ability_id", using: :btree

  create_table "games", force: :cascade do |t|
    t.integer "user_id", limit: 4
    t.string  "name",    limit: 255
    t.boolean "finish",  limit: 1
    t.integer "turn",    limit: 4
  end

  add_index "games", ["turn"], name: "index_games_on_turn", using: :btree
  add_index "games", ["user_id"], name: "index_games_on_user_id", using: :btree

  create_table "levels", force: :cascade do |t|
    t.integer "character_id", limit: 4
    t.integer "level",        limit: 4
    t.integer "exp",          limit: 4
  end

  add_index "levels", ["character_id"], name: "index_levels_on_character_id", using: :btree

  create_table "skills", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.text     "description", limit: 65535
    t.string   "skill_type",  limit: 255
    t.integer  "nb",          limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "special_abilities", force: :cascade do |t|
    t.string   "description", limit: 255
    t.string   "name",        limit: 255
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "provider",               limit: 255,                null: false
    t.string   "uid",                    limit: 255,   default: "", null: false
    t.string   "encrypted_password",     limit: 255,   default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,     default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
    t.string   "name",                   limit: 255
    t.string   "nickname",               limit: 255
    t.string   "image",                  limit: 255
    t.string   "email",                  limit: 255
    t.text     "tokens",                 limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true, using: :btree

  create_table "weapons", force: :cascade do |t|
    t.string  "range",           limit: 255
    t.integer "damage",          limit: 4
    t.integer "dice",            limit: 4
    t.integer "dice_to_success", limit: 4
    t.boolean "allow_open_door", limit: 1
    t.boolean "silent_kill",     limit: 1
    t.boolean "silent_door",     limit: 1
    t.boolean "ambidextry",      limit: 1
  end

  add_foreign_key "games", "users"
  add_foreign_key "levels", "characters"
end
