--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: clubStateType; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."clubStateType" AS ENUM (
    'Not ready',
    'Ready',
    'In a league'
);


ALTER TYPE public."clubStateType" OWNER TO "Emrecan";

--
-- Name: leagueStateType; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."leagueStateType" AS ENUM (
    'Not started',
    'In progress',
    'Finished'
);


ALTER TYPE public."leagueStateType" OWNER TO "Emrecan";

--
-- Name: playerStateType; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."playerStateType" AS ENUM (
    'Available',
    'In a club'
);


ALTER TYPE public."playerStateType" OWNER TO "Emrecan";

--
-- Name: refereeLicenseType; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."refereeLicenseType" AS ENUM (
    'Category FIFA',
    'Category S',
    'Category A',
    'Category B',
    'Category C'
);


ALTER TYPE public."refereeLicenseType" OWNER TO "Emrecan";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Club; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Club" (
    "clubId" integer NOT NULL,
    name character varying(60) NOT NULL,
    description character varying(2048) NOT NULL,
    "logoPath" character varying(2048) NOT NULL,
    "leagueId" integer,
    "cupCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Club" OWNER TO "Emrecan";

--
-- Name: Participant; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Participant" (
    "participantId" integer NOT NULL,
    username character varying(16) NOT NULL,
    password character varying(60) NOT NULL,
    email character varying(254) NOT NULL,
    "playerId" integer,
    "clubId" integer
);


ALTER TABLE public."Participant" OWNER TO "Emrecan";

--
-- Name: Player; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Player" (
    "playerId" integer NOT NULL,
    "clubId" integer,
    "fullName" character varying(30) NOT NULL,
    birthday date NOT NULL,
    "imgPath" character varying(2048) NOT NULL,
    goals integer DEFAULT 0 NOT NULL,
    assists integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Player" OWNER TO "Emrecan";

--
-- Name: ClubView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."ClubView" AS
 SELECT "Club"."clubId",
    "Club".name,
        CASE
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count > 7)) THEN 'Ready'::public."clubStateType"
            WHEN ("Club"."leagueId" IS NULL) THEN 'Not ready'::public."clubStateType"
            ELSE 'In a league'::public."clubStateType"
        END AS state,
    "playerByClub".count AS "playerCount",
    "Club"."cupCount",
    "Participant".email AS "participantEmail",
    "Club".description,
    "Club"."logoPath"
   FROM ((public."Club"
     JOIN public."Participant" ON (("Club"."clubId" = "Participant"."clubId")))
     LEFT JOIN ( SELECT "Player"."clubId",
            count(*) AS count
           FROM public."Player"
          GROUP BY "Player"."clubId") "playerByClub" ON (("playerByClub"."clubId" = "Club"."clubId")));


ALTER VIEW public."ClubView" OWNER TO "Emrecan";

--
-- Name: Club_clubId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."Club_clubId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Club_clubId_seq" OWNER TO "Emrecan";

--
-- Name: Club_clubId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Club_clubId_seq" OWNED BY public."Club"."clubId";


--
-- Name: Fixture; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Fixture" (
    "fixtureId" integer NOT NULL,
    "leagueId" integer NOT NULL,
    "homeClubId" integer NOT NULL,
    "awayClubId" integer NOT NULL,
    "homeTeamScore" integer,
    "awayTeamScore" integer,
    week integer NOT NULL,
    "refereeId" integer NOT NULL,
    "venueId" integer NOT NULL
);


ALTER TABLE public."Fixture" OWNER TO "Emrecan";

--
-- Name: Fixture_fixtureId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."Fixture_fixtureId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Fixture_fixtureId_seq" OWNER TO "Emrecan";

--
-- Name: Fixture_fixtureId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Fixture_fixtureId_seq" OWNED BY public."Fixture"."fixtureId";


--
-- Name: League; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."League" (
    "leagueId" integer NOT NULL,
    "organizerId" integer NOT NULL,
    name character varying(60) NOT NULL,
    prize integer NOT NULL,
    description character varying(2048) NOT NULL,
    "logoPath" character varying(2048) NOT NULL,
    state public."leagueStateType" NOT NULL
);


ALTER TABLE public."League" OWNER TO "Emrecan";

--
-- Name: Organizer; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Organizer" (
    "organizerId" integer NOT NULL,
    username character varying(16) NOT NULL,
    password character varying(60) NOT NULL,
    email character varying(254) NOT NULL
);


ALTER TABLE public."Organizer" OWNER TO "Emrecan";

--
-- Name: LeagueView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."LeagueView" AS
 SELECT "League"."leagueId",
    "League".name,
    "League".state,
    "League".prize,
    "Organizer".email AS "organizerEmail",
    "League".description,
    "League"."logoPath"
   FROM (public."League"
     JOIN public."Organizer" ON (("League"."organizerId" = "Organizer"."organizerId")));


ALTER VIEW public."LeagueView" OWNER TO "Emrecan";

--
-- Name: League_leagueId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."League_leagueId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."League_leagueId_seq" OWNER TO "Emrecan";

--
-- Name: League_leagueId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."League_leagueId_seq" OWNED BY public."League"."leagueId";


--
-- Name: League_organizerId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."League_organizerId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."League_organizerId_seq" OWNER TO "Emrecan";

--
-- Name: League_organizerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."League_organizerId_seq" OWNED BY public."League"."organizerId";


--
-- Name: Organizer_organizerId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."Organizer_organizerId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Organizer_organizerId_seq" OWNER TO "Emrecan";

--
-- Name: Organizer_organizerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Organizer_organizerId_seq" OWNED BY public."Organizer"."organizerId";


--
-- Name: Participant_participantId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."Participant_participantId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Participant_participantId_seq" OWNER TO "Emrecan";

--
-- Name: Participant_participantId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Participant_participantId_seq" OWNED BY public."Participant"."participantId";


--
-- Name: Performance; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Performance" (
    "playerId" integer NOT NULL,
    "fixtureId" integer NOT NULL,
    "goalCount" integer DEFAULT 0 NOT NULL,
    "assistCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Performance" OWNER TO "Emrecan";

--
-- Name: PlayerView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."PlayerView" AS
 SELECT "playerId",
    "clubId",
    "fullName",
    (EXTRACT(year FROM age((birthday)::timestamp with time zone)))::integer AS age,
    goals,
    assists,
    "imgPath",
        CASE
            WHEN ("clubId" IS NULL) THEN 'Available'::public."playerStateType"
            ELSE 'In a club'::public."playerStateType"
        END AS state
   FROM public."Player";


ALTER VIEW public."PlayerView" OWNER TO "Emrecan";

--
-- Name: Player_playerId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."Player_playerId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Player_playerId_seq" OWNER TO "Emrecan";

--
-- Name: Player_playerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Player_playerId_seq" OWNED BY public."Player"."playerId";


--
-- Name: Referee; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Referee" (
    "refereeId" integer NOT NULL,
    "fullName" character varying(30) NOT NULL,
    birthday date NOT NULL,
    email character varying(254) NOT NULL,
    "imgPath" character varying(2048) NOT NULL,
    "licenseType" public."refereeLicenseType" NOT NULL
);


ALTER TABLE public."Referee" OWNER TO "Emrecan";

--
-- Name: RefereeView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."RefereeView" AS
 SELECT "refereeId",
    "fullName",
    (EXTRACT(year FROM age((birthday)::timestamp with time zone)))::integer AS age,
    email,
    "licenseType",
    "imgPath"
   FROM public."Referee";


ALTER VIEW public."RefereeView" OWNER TO "Emrecan";

--
-- Name: Referee_refereeId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."Referee_refereeId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Referee_refereeId_seq" OWNER TO "Emrecan";

--
-- Name: Referee_refereeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Referee_refereeId_seq" OWNED BY public."Referee"."refereeId";


--
-- Name: Statistics; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Statistics" (
    "clubId" integer NOT NULL,
    "leagueId" integer NOT NULL,
    "winCount" integer DEFAULT 0 NOT NULL,
    "drawCount" integer DEFAULT 0 NOT NULL,
    "loseCount" integer DEFAULT 0 NOT NULL,
    scored integer DEFAULT 0 NOT NULL,
    conceded integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Statistics" OWNER TO "Emrecan";

--
-- Name: Venue; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Venue" (
    "venueId" integer NOT NULL,
    name character varying(60) NOT NULL,
    capacity integer NOT NULL,
    address character varying(254) NOT NULL,
    "imgPath" character varying(2048) NOT NULL,
    email character varying(254) NOT NULL
);


ALTER TABLE public."Venue" OWNER TO "Emrecan";

--
-- Name: VenueView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."VenueView" AS
 SELECT "venueId",
    name,
    capacity,
    address,
    "imgPath",
    email,
    row_number() OVER (ORDER BY capacity DESC) AS "capacityRank"
   FROM public."Venue";


ALTER VIEW public."VenueView" OWNER TO "Emrecan";

--
-- Name: Venue_venueId_seq; Type: SEQUENCE; Schema: public; Owner: Emrecan
--

CREATE SEQUENCE public."Venue_venueId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Venue_venueId_seq" OWNER TO "Emrecan";

--
-- Name: Venue_venueId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Venue_venueId_seq" OWNED BY public."Venue"."venueId";


--
-- Name: Club clubId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club" ALTER COLUMN "clubId" SET DEFAULT nextval('public."Club_clubId_seq"'::regclass);


--
-- Name: Fixture fixtureId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture" ALTER COLUMN "fixtureId" SET DEFAULT nextval('public."Fixture_fixtureId_seq"'::regclass);


--
-- Name: League leagueId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League" ALTER COLUMN "leagueId" SET DEFAULT nextval('public."League_leagueId_seq"'::regclass);


--
-- Name: Organizer organizerId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer" ALTER COLUMN "organizerId" SET DEFAULT nextval('public."Organizer_organizerId_seq"'::regclass);


--
-- Name: Participant participantId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant" ALTER COLUMN "participantId" SET DEFAULT nextval('public."Participant_participantId_seq"'::regclass);


--
-- Name: Player playerId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Player" ALTER COLUMN "playerId" SET DEFAULT nextval('public."Player_playerId_seq"'::regclass);


--
-- Name: Referee refereeId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee" ALTER COLUMN "refereeId" SET DEFAULT nextval('public."Referee_refereeId_seq"'::regclass);


--
-- Name: Venue venueId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Venue" ALTER COLUMN "venueId" SET DEFAULT nextval('public."Venue_venueId_seq"'::regclass);


--
-- Data for Name: Club; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Club" ("clubId", name, description, "logoPath", "leagueId", "cupCount") FROM stdin;
2	Galatasaray SK	Galatasaray is one of three teams to have participated in all seasons of the Süper Lig since 1959, following the dissolution of the Istanbul Football League.	https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Galatasaray_4_Sterne_Logo.svg/313px-Galatasaray_4_Sterne_Logo.svg.png	\N	0
3	Beşiktaş JK	The club's football team is one of the Big Three in Turkey and one of the most successful teams in the country, having never been relegated to a lower division. 	https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/BesiktasJK-Logo.svg/366px-BesiktasJK-Logo.svg.png	\N	0
1	Fenerbahçe SK	Fenerbahçe is one of the most successful Turkish clubs having won a record 28 Turkish championship titles.	https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Fenerbahçe.svg/316px-Fenerbahçe.svg.png	\N	0
\.


--
-- Data for Name: Fixture; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Fixture" ("fixtureId", "leagueId", "homeClubId", "awayClubId", "homeTeamScore", "awayTeamScore", week, "refereeId", "venueId") FROM stdin;
\.


--
-- Data for Name: League; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."League" ("leagueId", "organizerId", name, prize, description, "logoPath", state) FROM stdin;
1	14	Trendyol SüperLig	32000000	Turkish professional league for association football clubs. It is the top-flight of the Turkish football league system.	https://www.tff.org/Resources/TFF/Auto/da3d600a63ec4c508b44643a59dbc8b8.jpg	Not started
2	15	La Liga	180000000	La Liga is one of the most popular professional sports leagues globally, with an average attendance of 26,933 for league matches in the 2018–19 season.	https://images.sports.gracenote.com/images/lib/basic/sport/football/competition/logo/300/67.png	Not started
\.


--
-- Data for Name: Organizer; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Organizer" ("organizerId", username, password, email) FROM stdin;
14	organizer_1	$2b$10$znkbLBqsjiaBln33tfsM1eQ9UEmhxgAHlQaJnV/8iLAyHTn1.Lo9y	organizer_1@flos.com
15	organizer_2	$2b$10$Cod6GKzbuQJfcvpNvuHfPuO9WXgs35rYkTTlH2E4nNT.FBWhDQP66	organizer_2@flos.com
16	organizer_3	$2b$10$/USQiK.oxGHxCGFjcWcBeOm9VIcqqXdjOLcskgMhMB6XQ/4IXqPl6	organizer_3@flos.com
17	organizer_4	$2b$10$ruplHxvjLazB/j7kppnv8e6Q1upS/amCPyAPkcjnCHEEa2FmKIHGu	organizer_4@flos.com
\.


--
-- Data for Name: Participant; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Participant" ("participantId", username, password, email, "playerId", "clubId") FROM stdin;
5	participant_2	$2b$10$o795dzWRxjiPw5neq/9DuOTOOM3ZoUKzT5JT9ctA6.3gIRm5MfEca	participant_2@flos.com	2	1
6	participant_3	$2b$10$kW028/QvHi/AT6U6wV5JIeBdoeEqE.ZJxLIX/aIu0sRSitslJR2Xm	participant_3@flos.com	3	2
4	participant_1	$2b$10$ZpY3likPVWNSGftXTOc13.B8VjzQoQkjHgKZCe0uv7gpKekc0UECG	participant_1@flos.com	1	3
\.


--
-- Data for Name: Performance; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Performance" ("playerId", "fixtureId", "goalCount", "assistCount") FROM stdin;
\.


--
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Player" ("playerId", "clubId", "fullName", birthday, "imgPath", goals, assists) FROM stdin;
2	2	Mauro Icardi	1993-02-19	https://marriedbiography.com/wp-content/uploads/2019/06/Mauro-Icardi.jpg	0	0
1	1	Edin Dzeko	1986-03-17	https://i.pinimg.com/originals/f4/f3/b0/f4f3b0e7d7965b88907d4178d74dc7d3.png	0	0
3	3	Z. Ibrahimovic	1981-10-03	https://pbs.twimg.com/profile_images/1214310860576952321/dKb_Ih9K.jpg	0	0
4	\N	Roberto Carlos	1973-04-10	https://www.soccer.ru/sites/default/files/import-images/388852.jpg	0	0
\.


--
-- Data for Name: Referee; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Referee" ("refereeId", "fullName", birthday, email, "imgPath", "licenseType") FROM stdin;
1	Halil Umut Meler	1986-08-01	h.u.meler@flos.com	https://iasbh.tmgrup.com.tr/71eca0/366/366/271/0/990/720?u=https://isbh.tmgrup.com.tr/sbh/2022/11/05/son-dakika-haberi-galatasaray-besiktas-derbisinin-hakemi-halil-umut-meler-hangi-takimli-gercek-ortaya-cikti-1667633167985.jpg	Category S
4	Fırat Aydınus	1973-10-25	f.aydinus@flos.com	https://yandex-images.clstorage.net/fx98G4d01/dabf9eDGKRd/gFuaJxy1Suh8nZRwOnE6OgOgjDNrOI_L8I9rHcHjbfXSTzLDzCdcaqHUx4MsPY-H0np8PPfctuHmXI5DxF4yDRSIiSHbJohoPJ1XMnyze_jBo04ybjlPXeVX8ICcvbaqikWvnRL0XH30lRWRuSgZ3Al_PG5qiOV-NgheW9GCrJvL3Rauk26E7fPM0vLwMzp3nWpNv_l2k4t9UPvLkXtwoQJEp9Zb-lZ-8R8QRvgoVBOKJ3jraENpPLvM1tWQC-5ZjpiQYtlmQOS9xth6u7v9N9ulj3d78hZM-dz9jdf0uqiGS-PX3_iZ87RXngP46dcXhWPwoSUJIzC-hVfc0got1UhfESpTp8PjckgTs7J7OXUWI8l39vTbRfjZcoGSeTslTIntFhW5XHgw35FJcOXc30YkO-gpjyFxdEfd21kIohBFnZxlmyLMYPiLG_W4sjJ6Wu5AdXhwlgtyk7oJ3385LErGK9oU_ho3tdDVjHsglJ-EZfmlocBlNnjDF9bbCCVRRJcZp9CrxS9zC1n-83T79VSpQbD8dpPBcpR1y5bzvSHCj6KUX_7fdzHXE0R3ohcfDSp1rOJIYXz4AJFcU00s2YseUiPUpAnjvI0RNPq2Mbqao441eTMZRfwcPUOXufGvBwtjW9w7F7p_19CP9GqRX0LtfaUgy-h2MomR0NlJ7ZSCW1vnm-MC5byL2bg0cn83FGZOsvE7VQ171r-IXXn17AiCqtQccx8y-B7TD7iu198LZrtj5Uwn-bcCURuTjS5Tzp9a79brCSBxyh9wPPNytlTohn21tN4JM5C3DFp08ahMQqvbUfhWcz6QEAl_pxBWhal2bC3A5z55RNbbFQVuFQETWaqT7ANkPMAbdnCwdf_baYE89fZWArrYukgfMf0szEXsFB83Ff15ml_JuqBem4Qm-KtqAm52tE0d3NZBYlkNn19okmCBI_REETo9_XC10iPIcvyx00HzUjTMn0	Category S
3	Cüneyt Çakır	1976-11-23	c.cakir@flos.com	https://avatars.mds.yandex.net/i?id=d65b8482c370c9e4dabd7c21688f7646-5220648-images-thumbs&n=13	Category FIFA
2	Anthony Taylor	1978-10-20	a.taylor@flos.com	https://avatars.mds.yandex.net/i?id=cf11d34f691fe14af83c2e34a79d6088-5722855-images-thumbs&n=13	Category FIFA
5	Pierluigi Collina	1960-02-13	p.collina@flos.com	https://cdn.allfamous.org/people/avatars/pierluigi-collina-wkkn-allfamous.org.jpg	Category FIFA
\.


--
-- Data for Name: Statistics; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Statistics" ("clubId", "leagueId", "winCount", "drawCount", "loseCount", scored, conceded) FROM stdin;
\.


--
-- Data for Name: Venue; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Venue" ("venueId", name, capacity, address, "imgPath", email) FROM stdin;
2	Allianz Arena	75024	Werner-Heisenberg-Allee 25, 80939	https://img.welt.de/img/sport/fussball/mobile244457748/6992507277-ci102l-w1024/Allianz-Arena-Muenchen.jpg	contact@bm.com
4	Stadio San Siro	75817	Via Piccolomini 5, 20151 Milan	https://icdn.sempreinter.com/wp-content/uploads/2015/02/San_Siro_4.jpg	contact@acm.com
1	Şükrü Saraçoğlu Stadyumu	50530	Fenerbahce Tesisleri, Kadiköy, Istanbul	https://i.pinimg.com/originals/de/8d/5d/de8d5dc01022d91144a8d79d1760842e.jpg	contact@fb.com
3	Stade de France	81338	Zac du Cornillon Nord, 93200 Saint-Denis	https://cdn.idntimes.com/content-images/community/2022/05/whatsapp-image-2022-05-04-at-124847-c1d6eabaf1aef128b8a26b6b996d2eda-248186d588b62ecdc2d76d5802ff7228.jpeg	contact@psg.com
5	Spotify Camp Nou	99354	Avinguda Aristides Maillol, s/n, 08028, Barcelona	https://yt3.ggpht.com/ytc/AKedOLRCkb2tQJruC0VMBGgxYYoQVJoUceV_OghzN1py=s900-c-k-c0x00ffffff-no-rj	contact@barca.com
\.


--
-- Name: Club_clubId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Club_clubId_seq"', 3, true);


--
-- Name: Fixture_fixtureId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Fixture_fixtureId_seq"', 1, false);


--
-- Name: League_leagueId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."League_leagueId_seq"', 2, true);


--
-- Name: League_organizerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."League_organizerId_seq"', 1, false);


--
-- Name: Organizer_organizerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Organizer_organizerId_seq"', 17, true);


--
-- Name: Participant_participantId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Participant_participantId_seq"', 6, true);


--
-- Name: Player_playerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Player_playerId_seq"', 4, true);


--
-- Name: Referee_refereeId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Referee_refereeId_seq"', 5, true);


--
-- Name: Venue_venueId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Venue_venueId_seq"', 6, true);


--
-- Name: Club club_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT club_pk PRIMARY KEY ("clubId");


--
-- Name: Fixture fixture_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_pk PRIMARY KEY ("fixtureId");


--
-- Name: League league_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT league_pk PRIMARY KEY ("leagueId");


--
-- Name: Organizer organizer_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_email_uk UNIQUE (email);


--
-- Name: Organizer organizer_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_pk PRIMARY KEY ("organizerId");


--
-- Name: Organizer organizer_username_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_username_uk UNIQUE (username);


--
-- Name: Participant participant_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_email_uk UNIQUE (email);


--
-- Name: Participant participant_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_pk PRIMARY KEY ("participantId");


--
-- Name: Participant participant_username_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_username_uk UNIQUE (username);


--
-- Name: Performance performance_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_pk PRIMARY KEY ("playerId", "fixtureId");


--
-- Name: Player player_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT player_pk PRIMARY KEY ("playerId");


--
-- Name: Referee referee_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee"
    ADD CONSTRAINT referee_email_uk UNIQUE (email);


--
-- Name: Referee referee_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee"
    ADD CONSTRAINT referee_pk PRIMARY KEY ("refereeId");


--
-- Name: Statistics statistics_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_pk PRIMARY KEY ("clubId", "leagueId");


--
-- Name: Venue venue_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Venue"
    ADD CONSTRAINT venue_pk PRIMARY KEY ("venueId");


--
-- Name: Club club_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT club_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


--
-- Name: Fixture fixture_club_away_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_club_away_fk FOREIGN KEY ("awayClubId") REFERENCES public."Club"("clubId");


--
-- Name: Fixture fixture_club_home_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_club_home_fk FOREIGN KEY ("homeClubId") REFERENCES public."Club"("clubId");


--
-- Name: Fixture fixture_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


--
-- Name: Fixture fixture_referee_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_referee_fk FOREIGN KEY ("refereeId") REFERENCES public."Referee"("refereeId");


--
-- Name: Fixture fixture_venue_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_venue_fk FOREIGN KEY ("venueId") REFERENCES public."Venue"("venueId");


--
-- Name: League league_organizer_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT league_organizer_fk FOREIGN KEY ("organizerId") REFERENCES public."Organizer"("organizerId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Participant participant_club_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_club_fk FOREIGN KEY ("clubId") REFERENCES public."Club"("clubId");


--
-- Name: Participant participant_player_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_player_fk FOREIGN KEY ("playerId") REFERENCES public."Player"("playerId");


--
-- Name: Performance performance_fixture_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_fixture_fk FOREIGN KEY ("fixtureId") REFERENCES public."Fixture"("fixtureId");


--
-- Name: Performance performance_player_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_player_fk FOREIGN KEY ("playerId") REFERENCES public."Player"("playerId");


--
-- Name: Statistics statistics_club_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_club_fk FOREIGN KEY ("clubId") REFERENCES public."Club"("clubId");


--
-- Name: Statistics statistics_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


--
-- PostgreSQL database dump complete
--

