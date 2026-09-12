-- ==========================================================
-- Karachi Civic AI — "The City Around You" Schema
-- Supabase PostgreSQL Migration with pgvector and RLS
-- ==========================================================

-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Profiles Table (Citizens)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Authorities Table
CREATE TABLE IF NOT EXISTS public.authorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_name TEXT,
    authority_type TEXT,
    description TEXT,
    email TEXT,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Authority Jurisdictions
CREATE TABLE IF NOT EXISTS public.authority_jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    authority_id UUID REFERENCES public.authorities(id) ON DELETE CASCADE,
    name TEXT,
    area TEXT,
    town TEXT,
    district TEXT,
    keywords JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Issue Categories
CREATE TABLE IF NOT EXISTS public.issue_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT,
    description TEXT,
    keywords JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Issue Subcategories
CREATE TABLE IF NOT EXISTS public.issue_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.issue_categories(id) ON DELETE CASCADE,
    name TEXT,
    description TEXT,
    keywords JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT true
);

-- 7. Routing Rules
CREATE TABLE IF NOT EXISTS public.routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.issue_categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES public.issue_subcategories(id) ON DELETE SET NULL,
    authority_id UUID REFERENCES public.authorities(id) ON DELETE CASCADE,
    area TEXT,
    town TEXT,
    district TEXT,
    priority INTEGER DEFAULT 100,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Authority Contacts
CREATE TABLE IF NOT EXISTS public.authority_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    authority_id UUID REFERENCES public.authorities(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.issue_categories(id) ON DELETE SET NULL,
    email TEXT,
    contact_type TEXT DEFAULT 'official_complaint',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    input_type TEXT NOT NULL, -- 'photo', 'voice', 'text'
    original_text TEXT,
    transcript TEXT,
    normalized_english TEXT,
    english_complaint TEXT,
    urdu_complaint TEXT,
    category_id UUID REFERENCES public.issue_categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES public.issue_subcategories(id) ON DELETE SET NULL,
    authority_id UUID REFERENCES public.authorities(id) ON DELETE SET NULL,
    authority_email TEXT,
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    ai_confidence NUMERIC DEFAULT 0.0,
    status TEXT DEFAULT 'analyzing', -- 'analyzing', 'ready', 'sent', 'email_pending', 'email_failed', 'acknowledged', 'resolved', 'duplicate'
    duplicate_of UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    duplicate_confidence NUMERIC DEFAULT 0.0,
    report_count INTEGER DEFAULT 1,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_accuracy DOUBLE PRECISION,
    location_source TEXT, -- 'gps', 'exif', 'text', 'voice', 'map', 'manual', 'geocoded'
    location_confidence NUMERIC DEFAULT 0.0,
    address TEXT,
    area TEXT,
    town TEXT,
    district TEXT,
    location_text TEXT,
    image_path TEXT,
    audio_path TEXT,
    email_sent_at TIMESTAMPTZ,
    email_message_id TEXT,
    email_error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Complaint Embeddings
CREATE TABLE IF NOT EXISTS public.complaint_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID UNIQUE REFERENCES public.complaints(id) ON DELETE CASCADE,
    embedding VECTOR(384),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Complaint Events (Timeline Audit)
CREATE TABLE IF NOT EXISTS public.complaint_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Indexes
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_authority_id ON public.complaints(authority_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category_id ON public.complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_duplicate_of ON public.complaints(duplicate_of);
CREATE INDEX IF NOT EXISTS idx_complaints_coords ON public.complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_complaints_area ON public.complaints(area);
CREATE INDEX IF NOT EXISTS idx_complaints_town ON public.complaints(town);

-- 13. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;

-- Public read for lookup tables
CREATE POLICY "Public read authorities" ON public.authorities FOR SELECT USING (true);
CREATE POLICY "Public read issue categories" ON public.issue_categories FOR SELECT USING (true);
CREATE POLICY "Public read issue subcategories" ON public.issue_subcategories FOR SELECT USING (true);
CREATE POLICY "Public read routing rules" ON public.routing_rules FOR SELECT USING (true);

-- Complaints policies
CREATE POLICY "Users can insert complaints" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own complaints" ON public.complaints FOR SELECT USING (
    auth.uid() IS NULL OR user_id IS NULL OR auth.uid() = user_id
);
CREATE POLICY "Users can update own complaints" ON public.complaints FOR UPDATE USING (
    auth.uid() IS NULL OR auth.uid() = user_id
);

CREATE POLICY "Public read complaint events" ON public.complaint_events FOR SELECT USING (true);
CREATE POLICY "Public insert complaint events" ON public.complaint_events FOR INSERT WITH CHECK (true);

-- 14. SEED DATA

-- A. Authorities Seed
INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'Karachi Metropolitan Corporation', 'KMC', 'metropolitan', 'Planning, main roads, bridges, storm water drains, abattoirs, major parks, fire & rescue, land control and encroachment removal.', 'mayor@kmc.gos.pk', '+92 21 99215000')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('22222222-2222-2222-2222-222222222222', 'Karachi Water & Sewerage Corporation', 'KWSB', 'water_sewerage', 'Clean water supply, water filtration, sewerage network management, sewage overflows, and water pipe leakages.', 'info@kwsc.gos.pk', '+92 21 99245138')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('33333333-3333-3333-3333-333333333333', 'Sindh Solid Waste Management Board', 'SSWMB', 'waste_management', 'Residential & commercial garbage collection, waste transport, landfill operation, and municipal cleanliness.', NULL, '+92 3181030851')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('44444444-4444-4444-4444-444444444444', 'Cantonment Board Clifton', 'CBC', 'cantonment', 'Roads, streetlights, water supply, sanitation, parks, and building control in Clifton and DHA jurisdictions.', 'info@cbc.gov.pk', '+92 21 99251848')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('55555555-5555-5555-5555-555555555555', 'Cantonment Board Korangi & Landhi', 'CBKC', 'cantonment', 'Roads, sanitation, water, streetlights, and civic works in Korangi and Landhi Cantonment areas.', 'newceo.cbkc@gmail.com', '+92 21 35061611')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('66666666-6666-6666-6666-666666666666', 'Faisal Cantonment Board', 'FCB', 'cantonment', 'Civic services, roads, streetlights, water, and sanitation in Faisal Cantonment and Shahrah-e-Faisal zone.', 'faisalcantonmentboard@gmail.com', '+92 21 99240317')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('77777777-7777-7777-7777-777777777777', 'Malir Cantonment Board', 'MCB', 'cantonment', 'Civic maintenance, roads, water, streetlights, and sanitation in Malir Cantonment jurisdiction.', 'pa.cbmalir@gmail.com', '+92 21 99247201')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('88888888-8888-8888-8888-888888888888', 'Manora Cantonment Board', 'MNCB', 'cantonment', 'Municipal and development services for Manora island cantonment.', 'cbmanora75@gmail.com', '+92 21 32470001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.authorities (id, name, short_name, authority_type, description, email, phone) VALUES
('99999999-9999-9999-9999-999999999999', 'Town Administration', 'Town Admin', 'town_municipal', 'Maintenance of local roads, repair of potholes, streetlights, local street cleaning, and neighborhood sanitation.', 'mayor@kmc.gos.pk', '+92 21 99215000')
ON CONFLICT (id) DO NOTHING;

-- B. Issue Categories Seed
INSERT INTO public.issue_categories (id, name, display_name, description, keywords) VALUES
('c1000000-0000-0000-0000-000000000001', 'water_supply', 'Water Supply', 'Issues related to shortage, contamination, water pipe leaks, low pressure, or filtration.', '["pani", "water", "supply", "pipeline", "leakage", "filtration", "tanker"]'::jsonb),
('c1000000-0000-0000-0000-000000000002', 'sewage', 'Sewage & Sanitation', 'Overflowing gutters, blocked manholes, contaminated wastewater, and sewage leaks.', '["gutter", "sewer", "sewage", "overflow", "drainage blockage", "ganda pani"]'::jsonb),
('c1000000-0000-0000-0000-000000000003', 'garbage', 'Garbage & Waste', 'Uncollected garbage piles, overflowing dumpsters, waste transport, and dumping.', '["kachra", "garbage", "trash", "kuda", "dump", "safai", "solid waste"]'::jsonb),
('c1000000-0000-0000-0000-000000000004', 'drainage', 'Storm Water Drains', 'Blocked nullahs, rainwater drain clogs, seasonal flooding risks, and drain covers.', '["nullah", "drain", "rainwater", "storm drain", "barsati nala"]'::jsonb),
('c1000000-0000-0000-0000-000000000005', 'road_damage', 'Roads & Potholes', 'Damaged road surface, potholes, broken asphalt, sunken utility cuts, bridge issues.', '["sadak", "road", "pothole", "khadda", "broken street", "bridge"]'::jsonb),
('c1000000-0000-0000-0000-000000000006', 'street_lighting', 'Street Lighting', 'Broken streetlights, unlit dark streets, faulty electric poles, missing bulbs.', '["street light", "batti", "light pole", "dark street", "bijli ka khamba"]'::jsonb),
('c1000000-0000-0000-0000-000000000007', 'encroachment', 'Encroachment & Land Control', 'Illegal construction, footpaths blocked by vendors/stalls, unauthorized parking barriers.', '["tajawuzat", "encroachment", "footpath", "illegal occupation", "thela"]'::jsonb),
('c1000000-0000-0000-0000-000000000008', 'sanitation', 'Public Sanitation', 'Lack of public cleanliness, open debris, hazardous dumping, foul odors.', '["sanitation", "badboo", "malba", "debris", "public toilet"]'::jsonb),
('c1000000-0000-0000-0000-000000000009', 'parks', 'Parks & Playgrounds', 'Broken park benches, unattended green belts, neglected safari park or zoological garden.', '["park", "playground", "green belt", "safari park", "zoo", "benches"]'::jsonb),
('c1000000-0000-0000-0000-000000000010', 'fire_rescue', 'Fire & Rescue Safety', 'Fire hazards, blocked fire hydrants, emergency municipal safety risks.', '["aag", "fire", "rescue", "emergency", "fire hydrant"]'::jsonb),
('c1000000-0000-0000-0000-000000000011', 'municipal_charges', 'Municipal Utility Charges & Taxes', 'Disputed municipal utility tax, charged parking fraud, billboard violations.', '["tax", "utility charges", "charged parking", "billboard", "advertisement"]'::jsonb),
('c1000000-0000-0000-0000-000000000012', 'building_control', 'Building Control & Safety', 'Dangerous cracked buildings, illegal floor additions, hazardous constructions.', '["building", "illegal construction", "dangerous structure", "crack"]'::jsonb),
('c1000000-0000-0000-0000-000000000013', 'health_services', 'Public Health & Stray Animals', 'Dog bites, stray animal nuisance, municipal health clinic issues, pest fumigation.', '["kutte", "stray dogs", "fumigation", "mosquitoes", "hospital", "dispensary"]'::jsonb),
('c1000000-0000-0000-0000-000000000014', 'other', 'General Civic Issue', 'Other unclassified municipal service complaints.', '["shikayat", "complaint", "general", "other"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- C. Cantonment Jurisdictions Seed
INSERT INTO public.authority_jurisdictions (authority_id, name, area, town, district, keywords) VALUES
('44444444-4444-4444-4444-444444444444', 'Clifton & DHA', 'DHA', 'Clifton', 'South', '["dha", "clifton", "phase 1", "phase 2", "phase 4", "phase 5", "phase 6", "phase 7", "phase 8", "gizri", "boat basin", "sea view"]'::jsonb),
('55555555-5555-5555-5555-555555555555', 'Korangi Creek & Landhi Cantt', 'Korangi Creek', 'Korangi', 'Korangi', '["korangi cantt", "korangi creek", "landhi cantt"]'::jsonb),
('66666666-6666-6666-6666-666666666666', 'Faisal Cantt', 'Faisal Cantt', 'Faisal', 'East', '["faisal cantt", "shahrah-e-faisal cantt", "drigh road cantt", "karsaz cantt"]'::jsonb),
('77777777-7777-7777-7777-777777777777', 'Malir Cantt', 'Malir Cantt', 'Malir', 'Malir', '["malir cantt", "cantt checkpost", "airport road cantt", "safoora cantt"]'::jsonb),
('88888888-8888-8888-8888-888888888888', 'Manora Cantt', 'Manora', 'Keamari', 'Keamari', '["manora", "manora island", "keamari naval"]'::jsonb)
ON CONFLICT DO NOTHING;

-- D. Authority Contacts Seed
INSERT INTO public.authority_contacts (authority_id, category_id, email, contact_type) VALUES
('11111111-1111-1111-1111-111111111111', NULL, 'mayor@kmc.gos.pk', 'official_complaint'),
('22222222-2222-2222-2222-222222222222', NULL, 'info@kwsc.gos.pk', 'official_complaint'),
('44444444-4444-4444-4444-444444444444', NULL, 'info@cbc.gov.pk', 'official_complaint'),
('55555555-5555-5555-5555-555555555555', NULL, 'newceo.cbkc@gmail.com', 'official_complaint'),
('66666666-6666-6666-6666-666666666666', NULL, 'faisalcantonmentboard@gmail.com', 'official_complaint'),
('77777777-7777-7777-7777-777777777777', NULL, 'pa.cbmalir@gmail.com', 'official_complaint'),
('88888888-8888-8888-8888-888888888888', NULL, 'cbmanora75@gmail.com', 'official_complaint'),
('99999999-9999-9999-9999-999999999999', NULL, 'mayor@kmc.gos.pk', 'official_complaint')
ON CONFLICT DO NOTHING;
