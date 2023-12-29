--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2023-12-29 04:54:11 +03

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
-- TOC entry 923 (class 1247 OID 16792)
-- Name: ClubState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."ClubState" AS ENUM (
    'Not ready',
    'Ready',
    'Signed',
    'In a league'
);


ALTER TYPE public."ClubState" OWNER TO "Emrecan";

--
-- TOC entry 900 (class 1247 OID 16607)
-- Name: LeagueState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."LeagueState" AS ENUM (
    'Not started',
    'In progress',
    'Finished'
);


ALTER TYPE public."LeagueState" OWNER TO "Emrecan";

--
-- TOC entry 903 (class 1247 OID 16615)
-- Name: PlayerState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."PlayerState" AS ENUM (
    'Available',
    'In a club'
);


ALTER TYPE public."PlayerState" OWNER TO "Emrecan";

--
-- TOC entry 906 (class 1247 OID 16595)
-- Name: RefereeLicenseCategory; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."RefereeLicenseCategory" AS ENUM (
    'Category FIFA',
    'Category S',
    'Category A',
    'Category B',
    'Category C'
);


ALTER TYPE public."RefereeLicenseCategory" OWNER TO "Emrecan";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 16674)
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
-- TOC entry 225 (class 1259 OID 16573)
-- Name: League; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."League" (
    "leagueId" integer NOT NULL,
    "organizerId" integer NOT NULL,
    name character varying(60) NOT NULL,
    prize integer NOT NULL,
    description character varying(2048) NOT NULL,
    "logoPath" character varying(2048) NOT NULL,
    state public."LeagueState" DEFAULT 'Not started'::public."LeagueState" NOT NULL
);


ALTER TABLE public."League" OWNER TO "Emrecan";

--
-- TOC entry 218 (class 1259 OID 16436)
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
-- TOC entry 227 (class 1259 OID 16620)
-- Name: Player; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Player" (
    "playerId" integer NOT NULL,
    "clubId" integer,
    "fullName" character varying(30) NOT NULL,
    birthday date NOT NULL,
    "imgPath" character varying(2048) NOT NULL,
    goals integer DEFAULT 0 NOT NULL,
    assists integer DEFAULT 0 NOT NULL,
    biography character varying(2048) NOT NULL
);


ALTER TABLE public."Player" OWNER TO "Emrecan";

--
-- TOC entry 240 (class 1259 OID 16831)
-- Name: ClubView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."ClubView" AS
 SELECT "Club"."clubId",
    "League".name AS "leagueName",
    "Club".name,
        CASE
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count > 7)) THEN 'Ready'::public."ClubState"
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count < 7)) THEN 'Not ready'::public."ClubState"
            WHEN (("Club"."leagueId" IS NOT NULL) AND ("League".state = 'Not started'::public."LeagueState")) THEN 'Signed'::public."ClubState"
            ELSE 'In a league'::public."ClubState"
        END AS state,
    "playerByClub".count AS "playerCount",
    "Club"."cupCount",
    "Participant".email AS "participantEmail",
    "Club".description,
    "Club"."logoPath"
   FROM (((public."Club"
     JOIN public."Participant" ON (("Club"."clubId" = "Participant"."clubId")))
     LEFT JOIN ( SELECT "Player"."clubId",
            count(*) AS count
           FROM public."Player"
          GROUP BY "Player"."clubId") "playerByClub" ON (("playerByClub"."clubId" = "Club"."clubId")))
     LEFT JOIN public."League" ON (("Club"."leagueId" = "League"."leagueId")));


ALTER VIEW public."ClubView" OWNER TO "Emrecan";

--
-- TOC entry 231 (class 1259 OID 16673)
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
-- TOC entry 3790 (class 0 OID 0)
-- Dependencies: 231
-- Name: Club_clubId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Club_clubId_seq" OWNED BY public."Club"."clubId";


--
-- TOC entry 235 (class 1259 OID 16714)
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
-- TOC entry 234 (class 1259 OID 16713)
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
-- TOC entry 3791 (class 0 OID 0)
-- Dependencies: 234
-- Name: Fixture_fixtureId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Fixture_fixtureId_seq" OWNED BY public."Fixture"."fixtureId";


--
-- TOC entry 215 (class 1259 OID 16392)
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
-- TOC entry 230 (class 1259 OID 16664)
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
-- TOC entry 223 (class 1259 OID 16571)
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
-- TOC entry 3792 (class 0 OID 0)
-- Dependencies: 223
-- Name: League_leagueId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."League_leagueId_seq" OWNED BY public."League"."leagueId";


--
-- TOC entry 224 (class 1259 OID 16572)
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
-- TOC entry 3793 (class 0 OID 0)
-- Dependencies: 224
-- Name: League_organizerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."League_organizerId_seq" OWNED BY public."League"."organizerId";


--
-- TOC entry 241 (class 1259 OID 16837)
-- Name: MyClubView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyClubView" AS
 SELECT "Club"."clubId",
    "Participant"."participantId",
    "League".name AS "leagueName",
    "Club".name,
        CASE
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count > 7)) THEN 'Ready'::public."ClubState"
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count < 7)) THEN 'Not ready'::public."ClubState"
            WHEN (("Club"."leagueId" IS NOT NULL) AND ("League".state = 'Not started'::public."LeagueState")) THEN 'Signed'::public."ClubState"
            ELSE 'In a league'::public."ClubState"
        END AS state,
    "playerByClub".count AS "playerCount",
    "Club"."cupCount",
    "Participant".email AS "participantEmail",
    "Club".description,
    "Club"."logoPath"
   FROM (((public."Club"
     JOIN public."Participant" ON (("Club"."clubId" = "Participant"."clubId")))
     LEFT JOIN ( SELECT "Player"."clubId",
            count(*) AS count
           FROM public."Player"
          GROUP BY "Player"."clubId") "playerByClub" ON (("playerByClub"."clubId" = "Club"."clubId")))
     LEFT JOIN public."League" ON (("Club"."leagueId" = "League"."leagueId")));


ALTER VIEW public."MyClubView" OWNER TO "Emrecan";

--
-- TOC entry 238 (class 1259 OID 16810)
-- Name: MyLeagueView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyLeagueView" AS
 SELECT "League"."leagueId",
    "League"."organizerId",
    "League".name,
    "League".state,
    "League".prize,
    "Organizer".email AS "organizerEmail",
    "League".description,
    "League"."logoPath"
   FROM (public."League"
     JOIN public."Organizer" ON (("League"."organizerId" = "Organizer"."organizerId")));


ALTER VIEW public."MyLeagueView" OWNER TO "Emrecan";

--
-- TOC entry 239 (class 1259 OID 16815)
-- Name: MyPlayerView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyPlayerView" AS
 SELECT "Player"."playerId",
    "Participant"."participantId",
    "Club".name AS "clubName",
    "Player"."fullName",
    (EXTRACT(year FROM age(("Player".birthday)::timestamp with time zone)))::integer AS age,
    "Player".goals,
    "Player".assists,
    "Participant".email AS "participantEmail",
    "Player".biography,
    "Player"."imgPath",
        CASE
            WHEN ("Player"."clubId" IS NULL) THEN 'Available'::public."PlayerState"
            ELSE 'In a club'::public."PlayerState"
        END AS state
   FROM ((public."Player"
     JOIN public."Participant" ON (("Player"."playerId" = "Participant"."playerId")))
     LEFT JOIN public."Club" ON (("Player"."clubId" = "Club"."clubId")));


ALTER VIEW public."MyPlayerView" OWNER TO "Emrecan";

--
-- TOC entry 216 (class 1259 OID 16419)
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
-- TOC entry 3794 (class 0 OID 0)
-- Dependencies: 216
-- Name: Organizer_organizerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Organizer_organizerId_seq" OWNED BY public."Organizer"."organizerId";


--
-- TOC entry 217 (class 1259 OID 16435)
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
-- TOC entry 3795 (class 0 OID 0)
-- Dependencies: 217
-- Name: Participant_participantId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Participant_participantId_seq" OWNED BY public."Participant"."participantId";


--
-- TOC entry 236 (class 1259 OID 16745)
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
-- TOC entry 237 (class 1259 OID 16786)
-- Name: PlayerView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."PlayerView" AS
 SELECT "Player"."playerId",
    "Club".name AS "clubName",
    "Player"."fullName",
    (EXTRACT(year FROM age(("Player".birthday)::timestamp with time zone)))::integer AS age,
    "Player".goals,
    "Player".assists,
    "Participant".email AS "participantEmail",
    "Player".biography,
    "Player"."imgPath",
        CASE
            WHEN ("Player"."clubId" IS NULL) THEN 'Available'::public."PlayerState"
            ELSE 'In a club'::public."PlayerState"
        END AS state
   FROM ((public."Player"
     JOIN public."Participant" ON (("Player"."playerId" = "Participant"."playerId")))
     LEFT JOIN public."Club" ON (("Player"."clubId" = "Club"."clubId")));


ALTER VIEW public."PlayerView" OWNER TO "Emrecan";

--
-- TOC entry 226 (class 1259 OID 16619)
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
-- TOC entry 3796 (class 0 OID 0)
-- Dependencies: 226
-- Name: Player_playerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Player_playerId_seq" OWNED BY public."Player"."playerId";


--
-- TOC entry 220 (class 1259 OID 16522)
-- Name: Referee; Type: TABLE; Schema: public; Owner: Emrecan
--

CREATE TABLE public."Referee" (
    "refereeId" integer NOT NULL,
    "fullName" character varying(30) NOT NULL,
    birthday date NOT NULL,
    email character varying(254) NOT NULL,
    "imgPath" character varying(2048) NOT NULL,
    "licenseType" public."RefereeLicenseCategory" NOT NULL
);


ALTER TABLE public."Referee" OWNER TO "Emrecan";

--
-- TOC entry 228 (class 1259 OID 16643)
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
-- TOC entry 219 (class 1259 OID 16521)
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
-- TOC entry 3797 (class 0 OID 0)
-- Dependencies: 219
-- Name: Referee_refereeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Referee_refereeId_seq" OWNED BY public."Referee"."refereeId";


--
-- TOC entry 233 (class 1259 OID 16693)
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
-- TOC entry 222 (class 1259 OID 16533)
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
-- TOC entry 229 (class 1259 OID 16660)
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
-- TOC entry 221 (class 1259 OID 16532)
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
-- TOC entry 3798 (class 0 OID 0)
-- Dependencies: 221
-- Name: Venue_venueId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Venue_venueId_seq" OWNED BY public."Venue"."venueId";


--
-- TOC entry 3562 (class 2604 OID 16677)
-- Name: Club clubId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club" ALTER COLUMN "clubId" SET DEFAULT nextval('public."Club_clubId_seq"'::regclass);


--
-- TOC entry 3569 (class 2604 OID 16717)
-- Name: Fixture fixtureId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture" ALTER COLUMN "fixtureId" SET DEFAULT nextval('public."Fixture_fixtureId_seq"'::regclass);


--
-- TOC entry 3557 (class 2604 OID 16576)
-- Name: League leagueId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League" ALTER COLUMN "leagueId" SET DEFAULT nextval('public."League_leagueId_seq"'::regclass);


--
-- TOC entry 3553 (class 2604 OID 16455)
-- Name: Organizer organizerId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer" ALTER COLUMN "organizerId" SET DEFAULT nextval('public."Organizer_organizerId_seq"'::regclass);


--
-- TOC entry 3554 (class 2604 OID 16446)
-- Name: Participant participantId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant" ALTER COLUMN "participantId" SET DEFAULT nextval('public."Participant_participantId_seq"'::regclass);


--
-- TOC entry 3559 (class 2604 OID 16623)
-- Name: Player playerId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Player" ALTER COLUMN "playerId" SET DEFAULT nextval('public."Player_playerId_seq"'::regclass);


--
-- TOC entry 3555 (class 2604 OID 16525)
-- Name: Referee refereeId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee" ALTER COLUMN "refereeId" SET DEFAULT nextval('public."Referee_refereeId_seq"'::regclass);


--
-- TOC entry 3556 (class 2604 OID 16536)
-- Name: Venue venueId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Venue" ALTER COLUMN "venueId" SET DEFAULT nextval('public."Venue_venueId_seq"'::regclass);


--
-- TOC entry 3780 (class 0 OID 16674)
-- Dependencies: 232
-- Data for Name: Club; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Club" ("clubId", name, description, "logoPath", "leagueId", "cupCount") FROM stdin;
\.


--
-- TOC entry 3783 (class 0 OID 16714)
-- Dependencies: 235
-- Data for Name: Fixture; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Fixture" ("fixtureId", "leagueId", "homeClubId", "awayClubId", "homeTeamScore", "awayTeamScore", week, "refereeId", "venueId") FROM stdin;
\.


--
-- TOC entry 3776 (class 0 OID 16573)
-- Dependencies: 225
-- Data for Name: League; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."League" ("leagueId", "organizerId", name, prize, description, "logoPath", state) FROM stdin;
\.


--
-- TOC entry 3766 (class 0 OID 16392)
-- Dependencies: 215
-- Data for Name: Organizer; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Organizer" ("organizerId", username, password, email) FROM stdin;
\.


--
-- TOC entry 3769 (class 0 OID 16436)
-- Dependencies: 218
-- Data for Name: Participant; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Participant" ("participantId", username, password, email, "playerId", "clubId") FROM stdin;
\.


--
-- TOC entry 3784 (class 0 OID 16745)
-- Dependencies: 236
-- Data for Name: Performance; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Performance" ("playerId", "fixtureId", "goalCount", "assistCount") FROM stdin;
\.


--
-- TOC entry 3778 (class 0 OID 16620)
-- Dependencies: 227
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Player" ("playerId", "clubId", "fullName", birthday, "imgPath", goals, assists, biography) FROM stdin;
\.


--
-- TOC entry 3771 (class 0 OID 16522)
-- Dependencies: 220
-- Data for Name: Referee; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Referee" ("refereeId", "fullName", birthday, email, "imgPath", "licenseType") FROM stdin;
\.


--
-- TOC entry 3781 (class 0 OID 16693)
-- Dependencies: 233
-- Data for Name: Statistics; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Statistics" ("clubId", "leagueId", "winCount", "drawCount", "loseCount", scored, conceded) FROM stdin;
\.


--
-- TOC entry 3773 (class 0 OID 16533)
-- Dependencies: 222
-- Data for Name: Venue; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Venue" ("venueId", name, capacity, address, "imgPath", email) FROM stdin;
\.


--
-- TOC entry 3799 (class 0 OID 0)
-- Dependencies: 231
-- Name: Club_clubId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Club_clubId_seq"', 15, true);


--
-- TOC entry 3800 (class 0 OID 0)
-- Dependencies: 234
-- Name: Fixture_fixtureId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Fixture_fixtureId_seq"', 1, false);


--
-- TOC entry 3801 (class 0 OID 0)
-- Dependencies: 223
-- Name: League_leagueId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."League_leagueId_seq"', 9, true);


--
-- TOC entry 3802 (class 0 OID 0)
-- Dependencies: 224
-- Name: League_organizerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."League_organizerId_seq"', 1, false);


--
-- TOC entry 3803 (class 0 OID 0)
-- Dependencies: 216
-- Name: Organizer_organizerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Organizer_organizerId_seq"', 18, true);


--
-- TOC entry 3804 (class 0 OID 0)
-- Dependencies: 217
-- Name: Participant_participantId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Participant_participantId_seq"', 9, true);


--
-- TOC entry 3805 (class 0 OID 0)
-- Dependencies: 226
-- Name: Player_playerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Player_playerId_seq"', 15, true);


--
-- TOC entry 3806 (class 0 OID 0)
-- Dependencies: 219
-- Name: Referee_refereeId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Referee_refereeId_seq"', 5, true);


--
-- TOC entry 3807 (class 0 OID 0)
-- Dependencies: 221
-- Name: Venue_venueId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Venue_venueId_seq"', 6, true);


--
-- TOC entry 3595 (class 2606 OID 16681)
-- Name: Club club_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT club_pk PRIMARY KEY ("clubId");


--
-- TOC entry 3599 (class 2606 OID 16719)
-- Name: Fixture fixture_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_pk PRIMARY KEY ("fixtureId");


--
-- TOC entry 3591 (class 2606 OID 16581)
-- Name: League league_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT league_pk PRIMARY KEY ("leagueId");


--
-- TOC entry 3573 (class 2606 OID 16481)
-- Name: Organizer organizer_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_email_uk UNIQUE (email);


--
-- TOC entry 3575 (class 2606 OID 16457)
-- Name: Organizer organizer_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_pk PRIMARY KEY ("organizerId");


--
-- TOC entry 3577 (class 2606 OID 16465)
-- Name: Organizer organizer_username_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_username_uk UNIQUE (username);


--
-- TOC entry 3579 (class 2606 OID 16483)
-- Name: Participant participant_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_email_uk UNIQUE (email);


--
-- TOC entry 3581 (class 2606 OID 16448)
-- Name: Participant participant_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_pk PRIMARY KEY ("participantId");


--
-- TOC entry 3583 (class 2606 OID 16473)
-- Name: Participant participant_username_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_username_uk UNIQUE (username);


--
-- TOC entry 3601 (class 2606 OID 16751)
-- Name: Performance performance_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_pk PRIMARY KEY ("playerId", "fixtureId");


--
-- TOC entry 3593 (class 2606 OID 16627)
-- Name: Player player_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT player_pk PRIMARY KEY ("playerId");


--
-- TOC entry 3585 (class 2606 OID 16531)
-- Name: Referee referee_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee"
    ADD CONSTRAINT referee_email_uk UNIQUE (email);


--
-- TOC entry 3587 (class 2606 OID 16529)
-- Name: Referee referee_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee"
    ADD CONSTRAINT referee_pk PRIMARY KEY ("refereeId");


--
-- TOC entry 3597 (class 2606 OID 16702)
-- Name: Statistics statistics_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_pk PRIMARY KEY ("clubId", "leagueId");


--
-- TOC entry 3589 (class 2606 OID 16540)
-- Name: Venue venue_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Venue"
    ADD CONSTRAINT venue_pk PRIMARY KEY ("venueId");


--
-- TOC entry 3605 (class 2606 OID 16682)
-- Name: Club club_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT club_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


--
-- TOC entry 3608 (class 2606 OID 16730)
-- Name: Fixture fixture_club_away_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_club_away_fk FOREIGN KEY ("awayClubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3609 (class 2606 OID 16725)
-- Name: Fixture fixture_club_home_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_club_home_fk FOREIGN KEY ("homeClubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3610 (class 2606 OID 16720)
-- Name: Fixture fixture_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


--
-- TOC entry 3611 (class 2606 OID 16735)
-- Name: Fixture fixture_referee_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_referee_fk FOREIGN KEY ("refereeId") REFERENCES public."Referee"("refereeId");


--
-- TOC entry 3612 (class 2606 OID 16740)
-- Name: Fixture fixture_venue_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_venue_fk FOREIGN KEY ("venueId") REFERENCES public."Venue"("venueId");


--
-- TOC entry 3604 (class 2606 OID 16588)
-- Name: League league_organizer_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT league_organizer_fk FOREIGN KEY ("organizerId") REFERENCES public."Organizer"("organizerId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3602 (class 2606 OID 16687)
-- Name: Participant participant_club_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_club_fk FOREIGN KEY ("clubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3603 (class 2606 OID 16668)
-- Name: Participant participant_player_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_player_fk FOREIGN KEY ("playerId") REFERENCES public."Player"("playerId");


--
-- TOC entry 3613 (class 2606 OID 16757)
-- Name: Performance performance_fixture_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_fixture_fk FOREIGN KEY ("fixtureId") REFERENCES public."Fixture"("fixtureId");


--
-- TOC entry 3614 (class 2606 OID 16752)
-- Name: Performance performance_player_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_player_fk FOREIGN KEY ("playerId") REFERENCES public."Player"("playerId");


--
-- TOC entry 3606 (class 2606 OID 16703)
-- Name: Statistics statistics_club_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_club_fk FOREIGN KEY ("clubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3607 (class 2606 OID 16708)
-- Name: Statistics statistics_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


-- Completed on 2023-12-29 04:54:11 +03

--
-- PostgreSQL database dump complete
--

