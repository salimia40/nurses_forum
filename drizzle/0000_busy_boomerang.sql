CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "anonymous_identity" (
	"conversation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"pseudonym" text NOT NULL,
	"avatar_seed" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "anonymous_identity_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "attachment" (
	"id" text PRIMARY KEY NOT NULL,
	"file_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"relationship_type" text,
	"caption" text,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"added_by_id" text
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"icon" text,
	"is_regional" boolean DEFAULT false,
	"hospital_specific" boolean DEFAULT false,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "category_follow" (
	"category_id" text NOT NULL,
	"user_id" text NOT NULL,
	"notifications_enabled" boolean DEFAULT true,
	"followed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_follow_category_id_user_id_pk" PRIMARY KEY("category_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"thread_id" text NOT NULL,
	"author_id" text NOT NULL,
	"parent_id" text,
	"is_edited" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_reaction" (
	"comment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comment_reaction_comment_id_user_id_type_pk" PRIMARY KEY("comment_id","user_id","type")
);
--> statement-breakpoint
CREATE TABLE "content_report" (
	"id" text PRIMARY KEY NOT NULL,
	"reporter_id" text NOT NULL,
	"content_type" text NOT NULL,
	"content_id" text NOT NULL,
	"reason" text NOT NULL,
	"details" text,
	"status" text NOT NULL,
	"moderator_id" text,
	"moderator_notes" text,
	"resolution" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"is_group" boolean DEFAULT false,
	"is_anonymous" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"support_type" text,
	"created_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_message_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_participant" (
	"conversation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"is_admin" boolean DEFAULT false,
	"has_left" boolean DEFAULT false,
	"last_read_message_id" text,
	CONSTRAINT "conversation_participant_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "equipment_review" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"author_id" text NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"pros" text,
	"cons" text,
	"has_images" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text,
	"start_date_time" timestamp NOT NULL,
	"end_date_time" timestamp NOT NULL,
	"organizer_id" text NOT NULL,
	"type" text NOT NULL,
	"is_online" boolean DEFAULT false,
	"meeting_url" text,
	"max_participants" integer,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_participant" (
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_participant_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"extension" text,
	"size" integer NOT NULL,
	"uploader_id" text NOT NULL,
	"is_public" boolean DEFAULT false,
	"url" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp,
	"expires_at" timestamp,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "folder" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"owner_id" text NOT NULL,
	"parent_id" text,
	"is_shared" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folder_file" (
	"id" text PRIMARY KEY NOT NULL,
	"folder_id" text NOT NULL,
	"file_id" text NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentorship" (
	"id" text PRIMARY KEY NOT NULL,
	"mentor_id" text NOT NULL,
	"mentee_id" text NOT NULL,
	"status" text NOT NULL,
	"specialty_focus" text,
	"notes" text,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"has_attachments" boolean DEFAULT false,
	"is_edited" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"is_read" boolean DEFAULT false,
	"link_url" text,
	"related_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nurse_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"specialty" text,
	"license_number" text,
	"license_verified" boolean DEFAULT false,
	"hospital_affiliation" text,
	"years_of_experience" integer,
	"education" text,
	"certifications" json,
	"bio" text,
	"consent_to_mentorship" boolean DEFAULT false,
	"available_for_shift_swaps" boolean DEFAULT false,
	"profile_completeness" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nurse_profile_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" text NOT NULL,
	"credential_i_d" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "policy_update" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"hospital" text,
	"region" text,
	"effective_date" date,
	"has_attachments" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource" (
	"thread_id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"url" text,
	"has_attachment" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resource_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "resource_to_tag" (
	"resource_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "resource_to_tag_resource_id_tag_id_pk" PRIMARY KEY("resource_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "shift" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"location" text NOT NULL,
	"department" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_application" (
	"id" text PRIMARY KEY NOT NULL,
	"shift_id" text NOT NULL,
	"applicant_id" text NOT NULL,
	"status" text NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category_id" text NOT NULL,
	"author_id" text NOT NULL,
	"is_pinned" boolean DEFAULT false,
	"is_locked" boolean DEFAULT false,
	"view_count" integer DEFAULT 0 NOT NULL,
	"follow_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_follow" (
	"thread_id" text NOT NULL,
	"user_id" text NOT NULL,
	"notifications_enabled" boolean DEFAULT true,
	"followed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "thread_follow_thread_id_user_id_pk" PRIMARY KEY("thread_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "thread_reaction" (
	"thread_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "thread_reaction_thread_id_user_id_type_pk" PRIMARY KEY("thread_id","user_id","type")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text,
	"display_username" text,
	"phone_number" text,
	"phone_number_verified" boolean,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "user_follow" (
	"followed_id" text NOT NULL,
	"follower_id" text NOT NULL,
	"notifications_enabled" boolean DEFAULT true,
	"followed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_follow_followed_id_follower_id_pk" PRIMARY KEY("followed_id","follower_id")
);
--> statement-breakpoint
CREATE TABLE "user_notification_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"email_notifications" boolean DEFAULT true,
	"sms_notifications" boolean DEFAULT false,
	"push_notifications" boolean DEFAULT true,
	"thread_replies" boolean DEFAULT true,
	"direct_messages" boolean DEFAULT true,
	"mentorship_requests" boolean DEFAULT true,
	"event_reminders" boolean DEFAULT true,
	"shift_applications" boolean DEFAULT true,
	"resource_updates" boolean DEFAULT true,
	"policy_updates" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_report" (
	"id" text PRIMARY KEY NOT NULL,
	"reporter_id" text NOT NULL,
	"reported_user_id" text NOT NULL,
	"reason" text NOT NULL,
	"details" text,
	"status" text NOT NULL,
	"moderator_id" text,
	"moderator_notes" text,
	"resolution" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anonymous_identity" ADD CONSTRAINT "anonymous_identity_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anonymous_identity" ADD CONSTRAINT "anonymous_identity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_added_by_id_user_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_follow" ADD CONSTRAINT "category_follow_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_follow" ADD CONSTRAINT "category_follow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reaction" ADD CONSTRAINT "comment_reaction_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reaction" ADD CONSTRAINT "comment_reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_reporter_id_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_review" ADD CONSTRAINT "equipment_review_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_organizer_id_user_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_uploader_id_user_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_parent_id_folder_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_file" ADD CONSTRAINT "folder_file_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_file" ADD CONSTRAINT "folder_file_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship" ADD CONSTRAINT "mentorship_mentor_id_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship" ADD CONSTRAINT "mentorship_mentee_id_user_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nurse_profile" ADD CONSTRAINT "nurse_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy_update" ADD CONSTRAINT "policy_update_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_to_tag" ADD CONSTRAINT "resource_to_tag_resource_id_resource_thread_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("thread_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_to_tag" ADD CONSTRAINT "resource_to_tag_tag_id_resource_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."resource_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift" ADD CONSTRAINT "shift_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_application" ADD CONSTRAINT "shift_application_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_application" ADD CONSTRAINT "shift_application_applicant_id_user_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_follow" ADD CONSTRAINT "thread_follow_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_follow" ADD CONSTRAINT "thread_follow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_reaction" ADD CONSTRAINT "thread_reaction_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_reaction" ADD CONSTRAINT "thread_reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followed_id_user_id_fk" FOREIGN KEY ("followed_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_report" ADD CONSTRAINT "user_report_reporter_id_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_report" ADD CONSTRAINT "user_report_reported_user_id_user_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_report" ADD CONSTRAINT "user_report_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "anonymous_identity_conversation_id_idx" ON "anonymous_identity" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "attachment_file_id_idx" ON "attachment" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "attachment_entity_idx" ON "attachment" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "attachment_is_primary_idx" ON "attachment" USING btree ("is_primary");--> statement-breakpoint
CREATE INDEX "attachment_added_at_idx" ON "attachment" USING btree ("added_at");--> statement-breakpoint
CREATE INDEX "attachment_relationship_type_idx" ON "attachment" USING btree ("relationship_type");--> statement-breakpoint
CREATE INDEX "category_slug_idx" ON "category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "category_follow_category_id_idx" ON "category_follow" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "category_follow_user_id_idx" ON "category_follow" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comment_thread_id_idx" ON "comment" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "comment_author_id_idx" ON "comment" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "comment_parent_id_idx" ON "comment" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "content_report_reporter_id_idx" ON "content_report" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "content_report_content_type_id_idx" ON "content_report" USING btree ("content_type","content_id");--> statement-breakpoint
CREATE INDEX "content_report_status_idx" ON "content_report" USING btree ("status");--> statement-breakpoint
CREATE INDEX "conversation_created_by_id_idx" ON "conversation" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "conversation_last_message_at_idx" ON "conversation" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "conversation_is_anonymous_idx" ON "conversation" USING btree ("is_anonymous");--> statement-breakpoint
CREATE INDEX "equipment_review_author_id_idx" ON "equipment_review" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "equipment_review_category_idx" ON "equipment_review" USING btree ("category");--> statement-breakpoint
CREATE INDEX "equipment_review_rating_idx" ON "equipment_review" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "event_organizer_id_idx" ON "event" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "event_start_date_time_idx" ON "event" USING btree ("start_date_time");--> statement-breakpoint
CREATE INDEX "event_type_idx" ON "event" USING btree ("type");--> statement-breakpoint
CREATE INDEX "event_participant_status_idx" ON "event_participant" USING btree ("status");--> statement-breakpoint
CREATE INDEX "file_uploader_id_idx" ON "file" USING btree ("uploader_id");--> statement-breakpoint
CREATE INDEX "file_uploaded_at_idx" ON "file" USING btree ("uploaded_at");--> statement-breakpoint
CREATE INDEX "file_mime_type_idx" ON "file" USING btree ("mime_type");--> statement-breakpoint
CREATE INDEX "folder_owner_id_idx" ON "folder" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "folder_parent_id_idx" ON "folder" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "folder_path_idx" ON "folder" USING btree ("path");--> statement-breakpoint
CREATE INDEX "folder_file_folder_id_idx" ON "folder_file" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "folder_file_file_id_idx" ON "folder_file" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "mentorship_mentor_id_idx" ON "mentorship" USING btree ("mentor_id");--> statement-breakpoint
CREATE INDEX "mentorship_mentee_id_idx" ON "mentorship" USING btree ("mentee_id");--> statement-breakpoint
CREATE INDEX "mentorship_status_idx" ON "mentorship" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_conversation_id_idx" ON "message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_sender_id_idx" ON "message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_created_at_idx" ON "message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_is_read_idx" ON "notification" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notification" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "nurse_profile_specialty_idx" ON "nurse_profile" USING btree ("specialty");--> statement-breakpoint
CREATE INDEX "nurse_profile_hospital_idx" ON "nurse_profile" USING btree ("hospital_affiliation");--> statement-breakpoint
CREATE INDEX "passkey_user_id_idx" ON "passkey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "policy_update_author_id_idx" ON "policy_update" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "policy_update_hospital_idx" ON "policy_update" USING btree ("hospital");--> statement-breakpoint
CREATE INDEX "policy_update_region_idx" ON "policy_update" USING btree ("region");--> statement-breakpoint
CREATE INDEX "policy_update_effective_date_idx" ON "policy_update" USING btree ("effective_date");--> statement-breakpoint
CREATE INDEX "resource_type_idx" ON "resource" USING btree ("type");--> statement-breakpoint
CREATE INDEX "resource_tag_name_idx" ON "resource_tag" USING btree ("name");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shift_user_id_idx" ON "shift" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shift_date_idx" ON "shift" USING btree ("date");--> statement-breakpoint
CREATE INDEX "shift_status_idx" ON "shift" USING btree ("status");--> statement-breakpoint
CREATE INDEX "shift_department_idx" ON "shift" USING btree ("department");--> statement-breakpoint
CREATE INDEX "shift_application_shift_id_idx" ON "shift_application" USING btree ("shift_id");--> statement-breakpoint
CREATE INDEX "shift_application_applicant_id_idx" ON "shift_application" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "shift_application_status_idx" ON "shift_application" USING btree ("status");--> statement-breakpoint
CREATE INDEX "thread_category_id_idx" ON "thread" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "thread_author_id_idx" ON "thread" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "thread_last_activity_idx" ON "thread" USING btree ("last_activity_at");--> statement-breakpoint
CREATE INDEX "thread_follow_thread_id_idx" ON "thread_follow" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "thread_follow_user_id_idx" ON "thread_follow" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_username_idx" ON "user" USING btree ("username");--> statement-breakpoint
CREATE INDEX "user_phone_number_idx" ON "user" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "user_follow_followed_id_idx" ON "user_follow" USING btree ("followed_id");--> statement-breakpoint
CREATE INDEX "user_follow_follower_id_idx" ON "user_follow" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "user_report_reporter_id_idx" ON "user_report" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "user_report_reported_user_id_idx" ON "user_report" USING btree ("reported_user_id");--> statement-breakpoint
CREATE INDEX "user_report_status_idx" ON "user_report" USING btree ("status");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");