--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2023-12-29 20:40:55 +03

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
-- TOC entry 920 (class 1247 OID 16792)
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
-- TOC entry 897 (class 1247 OID 16607)
-- Name: LeagueState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."LeagueState" AS ENUM (
    'Not started',
    'In progress',
    'Finished'
);


ALTER TYPE public."LeagueState" OWNER TO "Emrecan";

--
-- TOC entry 900 (class 1247 OID 16615)
-- Name: PlayerState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."PlayerState" AS ENUM (
    'Available',
    'In a club'
);


ALTER TYPE public."PlayerState" OWNER TO "Emrecan";

--
-- TOC entry 903 (class 1247 OID 16595)
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
-- TOC entry 231 (class 1259 OID 16674)
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
-- TOC entry 239 (class 1259 OID 16831)
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
-- TOC entry 230 (class 1259 OID 16673)
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
-- Dependencies: 230
-- Name: Club_clubId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Club_clubId_seq" OWNED BY public."Club"."clubId";


--
-- TOC entry 234 (class 1259 OID 16714)
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
-- TOC entry 233 (class 1259 OID 16713)
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
-- Dependencies: 233
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
-- TOC entry 229 (class 1259 OID 16664)
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
-- TOC entry 240 (class 1259 OID 16837)
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
-- TOC entry 237 (class 1259 OID 16810)
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
-- TOC entry 238 (class 1259 OID 16815)
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
-- TOC entry 235 (class 1259 OID 16745)
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
-- TOC entry 236 (class 1259 OID 16786)
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
-- TOC entry 241 (class 1259 OID 16842)
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
-- TOC entry 232 (class 1259 OID 16693)
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
-- TOC entry 228 (class 1259 OID 16660)
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
-- Dependencies: 231
-- Data for Name: Club; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Club" ("clubId", name, description, "logoPath", "leagueId", "cupCount") FROM stdin;
\.


--
-- TOC entry 3783 (class 0 OID 16714)
-- Dependencies: 234
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
26	emrcnkaracayir	$2b$10$AFux7Td/7NggkvLraqDxouGQtgqDJDhTGfJW78jB2FNHo.H8QY2T2	emrecan.karacayir@flos.com
32	yalcincebi	$2b$10$xYA.FwnB0Qbub0DRqpQYFetbhPv2wA8Tn10DUYz0jfn.3KDZ.MORi	yalcin.cebi@flos.com
33	deryabirant	$2b$10$TIS3AIwwVceE.nNv7ABnj.sNlRyPXMLZrJa1WWpGQ2FVP41/F16rS	derya.birant@flos.com
34	gokhandalkilic	$2b$10$NS2GnkwtxU.n/QOPNMjXMOrgpqs92qIRS1unfc3.pSpyZc36hRWDC	gokhan.dalkilic@flos.com
35	semihutku	$2b$10$IkdaaLnER9OJCM7AUBMWBOXFrJDv2R1RiOo0lUlmq/Y5Go2cK46Q2	semih.utku@flos.com
36	mehmetozcanhan	$2b$10$9bxDZweFueI/dRp6mrBVXud6ze5uiJIp9vdg3KAWN8HU0FpBXq4Fy	mehmet.hilal.ozcanhan@flos.com
37	zerrinisik	$2b$10$Iciu3lpeuSjSemcpdEVVR.Zo9aSLPR37HqdKHMn88.8FyO8VRpgre	zerrin.isik@flos.com
38	ulasbirant	$2b$10$eQzJvbt90vnTWcLb3PJVL.rn6BwmPhs0RERVotnb9oMQlZ3Eu5yOW	kokten.ulas.birant@flos.com
39	ozlemaktas	$2b$10$PlWxmxvKq157KoNBGFH2neASwPkSn44A8itQjGrBhkQ7eecysCl72	ozlem.aktas@flos.com
40	yunusdogan	$2b$10$Ko6eqQYhLlCyhxPUiem9/.6eeLhXNN8q71ucOCBF0hw68dRsDoKDO	yunus.dogan@flos.com
41	feristahdalkilic	$2b$10$eEv5eg66Ub92T69PoEguf.e3NTE2xQQxopYfCTyBBhyvhh7M17Hv.	feristah.dalkilic@flos.com
27	veyselsaydam	$2b$10$1FiYl17sE/slEDN5jMsbg.hrbWig2I6LJmgHDyDL5Pv0jRbi86UBC	veysel.saydam@flos.com
42	ozgetokmak	$2b$10$PC6DYp4pJP.2XE2VpklTMu.HORo6jnwzmDbNdTtCltqHMcjoNY0Z.	ozge.kart.tokmak@flos.com
43	goksutuysuzoglu	$2b$10$xzfpDDDw0QsbNH90muivDe0HI3nICwCibB8IUGgPS1rxqKNr1TOqC	goksu.tuysuzoglu@flos.com
44	ozlemozturk	$2b$10$ABLv2bfY22JvREKjI3FGcuQ4XwfHl76NPLxdCArQJOpaVHzs2YVSK	ozlem.ozturk@flos.com
45	serifeyilmaz	$2b$10$9bBW.lHNv.A5ds2X5Zwvo.v6J7zuRFxZjE7QfouVdG38wkcno7tty	serife.yilmaz@flos.com
46	tanzeronurgil	$2b$10$x5kIkhSLGaROmU5bpoHlJOMyKem8Nz2CbHuJn9iO2pdxmKMchXIW6	tanzer.onurgil@flos.com
47	atakankubilay	$2b$10$B1H/bYDlOUqCJQZVmq2NHuZRwsmGfS3EZYYDLoGEAh4kvNn5lg0zm	atakan.kubilay@flos.com
48	fatihdicle	$2b$10$ANm9KxNzJcOgJcLuxJGKquX6xJFERvE8VJGzQQ5TpuxbeNVQG4U.y	fatih.dicle@flos.com
31	alpkut	$2b$10$1QGrKRHQK6XXz6tV6TS6CO8W6eGwhc2/d44QNjqIbANEMKv2s9qL6	recep.alp.kut@flos.com
54	onurdoganlar	$2b$10$yyZ6J1IVp1CLLctjneQlFOFxY03fEnBE7oOGg/I.O.kW.gBvRaQyW	onur.can.doganlar@flos.com
55	meltemekici	$2b$10$zxIVT/xJ48DcBAoZ5GJ7KeBYPjlyBZPRBjG3dbgm/79KbmxEgn5L2	meltem.yildirim.ekici@flos.com
\.


--
-- TOC entry 3769 (class 0 OID 16436)
-- Dependencies: 218
-- Data for Name: Participant; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Participant" ("participantId", username, password, email, "playerId", "clubId") FROM stdin;
19	abdulkadiromur	$2b$10$PmzR4NlOBdUqkiEj4HXWu.zTppRRz5Tz0pijbk3rWPvQY2Xb/zqmK	abdulkadir.omur@flos.com	24	\N
20	abdulkadirparmak	$2b$10$GT2jDg6n.dsSgjrvKNvu7eoz3x2q9jjZD1aEvJaCzGoCwXOArDKIu	abdulkadir.parmak@flos.com	25	\N
21	abdulkadirsunger	$2b$10$ScyGFHsy7OAoQ2VbaKkua.BNvPlx2hLfyUrRGIEsuiT5NRHN950yW	abdulkadir.sunger@flos.com	26	\N
22	abdulkadirtasdan	$2b$10$SdHbo/BPG10TWhx9hrUPdey2Ec6HwFZV28XTTDIfaKbzyz5x9kUDm	abdulkadir.tasdan@flos.com	27	\N
23	abdlkrmbardakci	$2b$10$Ggjo2eARKvr4lukaQHONSeWI7PiCFnnqU422zUj9sEsyN2BqWMh4C	abdulkerim.bardakci@flos.com	28	\N
24	abdullahavci	$2b$10$irIUPT95qRy7uTYBBwDBkuVINho38KsDP54tML56kRamRdUDwDtw.	abdullah.avci@flos.com	29	\N
25	abdullahdurak	$2b$10$il9UfmITjcrG77ciefrGaOrflICH876fA2WrPiFYH/FHySrJgWHxG	abdullah.durak@flos.com	30	\N
26	abdllhsahindere	$2b$10$ZqldCukR2e5IvV53SwUZtOuiHRIrks0/iX5sINGsA257WgNk.5GSG	abdullah.sahindere@flos.com	31	\N
27	abdullahyigitler	$2b$10$FEJKSER2YJgSrF3Ck4IIgOPERdI8MuWA5pyiVUDUswz00mD7gZQDS	abdullah.yigitler@flos.com	32	\N
28	abdulsameddamlu	$2b$10$jv6nkaVxrTjjZlwksl5Kru3g1bd39BoKFVgl3m3wDEfXj8ddjeftG	abdulsamed.damlu@flos.com	33	\N
29	abdurrahimdursun	$2b$10$B9vNcSiibRehkrVHR4X3TupbtCEgfH6vxm6/CUzzaTc9W/eXnznIi	abdurrahim.dursun@flos.com	34	\N
30	abdurrahmancanli	$2b$10$BPF3CnArnzWvYrxvIrvhH.a.pTZa8VN.izPFI7PxCcAy7L1xBKmqe	abdurrahman.canli@flos.com	35	\N
31	abdussmdkarnucu	$2b$10$vzYHEuD0AVb8iGIFX.rububJBUdaNSTMQqZjulypSaQ7utw9cwB5q	abdussamed.karnucu@flos.com	36	\N
32	ademagaoglu	$2b$10$Vzq2jj7SdTwgiYCnBI666.rO7MP7ojR7yzqcD6OYEPAZs2tdckbdG	adem.agaoglu@flos.com	37	\N
10	emrcnkaracayir	$2b$10$IvHkDCrGahTNnQ5pS6XDSelwBGVSaHGat.ZKnPs19jPxp6r1upr9y	emrecan.karacayir@flos.com	\N	\N
11	veyselsaydam	$2b$10$q7FKzQzdO5dX/KjImiFkFeTQHF4IMk3XlBlZeKW/8Frqv9DNItdBm	veysel.saydam@flos.com	\N	\N
12	ilhanparlak	$2b$10$xwbyml6NOZy.s5vI9ejn7.YKLoSiBxQzzYKG7mMHs.6/ea6i0o2R6	ilhan.parlak@flos.com	16	\N
13	seyhmusaksu	$2b$10$4hXP/NYDJ2ccsbwPnPoJ/Oqe2r4JLe/4cKwF940dLpaLRHGmJpoay	seyhmus.aksu@flos.com	17	\N
14	umitaydin	$2b$10$2recAZSt4edWxiu8HBDSP.vTJhdqHnfKDiy48WMkDJlHmeRcH8uPe	umit.aydin@flos.com	19	\N
15	abdlzdemircan	$2b$10$pR19F2iN2/sBRqyzF0CLBeM98HIBlVdW1.XakBdIlcd77N86EA1Eq	a.demircan@flos.com	20	\N
16	cebrailakbulut	$2b$10$gJoGKh7UbkyqjX3/5P5gmeA0Ze17xmk/LoiDg3.AUMFO3GTaie04m	a.cebrail.akbulut@flos.com	21	\N
17	abdulkadirdemir	$2b$10$dcB/UEXgqGN.rQ7fHqr9U.umRQSLTzd6ICsCFAlLGbkfXkiIpbyxu	abdulkadir.demir@flos.com	22	\N
18	abdulkadirkayali	$2b$10$kk2DsJXPPLXU58UxGPqexOKVkaaMqLofvI7FaBEhzbKjxqCTCr6MG	abdulkadir.kayali@flos.com	23	\N
33	adembuyuk	$2b$10$P4a03J5C65vPuWhOSJwy3.Vjzejy.rChWJpWyzqg1AdgStRm0DMuS	adem.buyuk@flos.com	38	\N
34	ademdogan	$2b$10$eEEg9whp.c9tXwvOn053huoPYYytrkE63cx1dUp.W8qJeaNuzMG5G	adem.dogan@flos.com	39	\N
35	ademmetinturk	$2b$10$9HrlHBbm6wupEUq25EfkueDo7459D5lB5/7rkqVC0.8C1v8juwxra	adem.metin.turk@flos.com	40	\N
36	ademdemirbag	$2b$10$ZvQxWGoHULw3.9C3lGU6sOeUaC/mFt/B9LmbSyUiI98TszYHQ0eWK	adem.demirbag@flos.com	41	\N
40	ahmetcanbaz	$2b$10$jj0lHDqxbYPvklt2ixk8Eu3brid5a1TRvKI4Ruv0v.WH41GrdM67q	ahmet.canbaz@flos.com	45	\N
37	ahmedyildiz	$2b$10$fsuZUygHWTvmcRymQOLoz.r4SdX1ohQmfM7wyCdqTol53Nm.MYihG	ahmed.yildiz@flos.com	42	\N
38	ahmedkutucu	$2b$10$RxT8DBY6oomcMFqiu5M/n.CA7WH4C5hE87RyHixitTjCyZcVfmyiG	ahmed.kutucu@flos.com	43	\N
39	ahmetcalik	$2b$10$tqpFpgSrzYNMnenz18aTEeuCCasQkHVFpUoqfK8VD.oNGGzXIxvsW	ahmet.calik@flos.com	44	\N
41	ahmetcelik	$2b$10$qAt3edPpw5BUwk.j//0eeOR3eGheE5UNG8lG3Cfe.X.jxmq1RT.7i	ahmet.celik@flos.com	46	\N
42	ahmetcolak	$2b$10$Fr4ZAISI3lAcIIPfMj/UCu4oouNEYHzk9CelwCyOwZTnfO4gDHLZ6	ahmet.colak@flos.com	47	\N
43	ahmetdemirli	$2b$10$HD6Anh6iHCrnNW.BngKEv.dUVHqkGsB4DcyUyWpZZO38Qet5qYEz.	ahmet.demirli@flos.com	48	\N
44	ahmetgulay	$2b$10$M9F8USt7Jgs6Knl9Cg3p/eW9N7P/8vPOgOdtt1ZdnksPYfxAy3GPq	ahmet.gulay@flos.com	49	\N
45	ahmetgurleyen	$2b$10$AhqQmRnkE9JObdg6MoRaX.LVZTZ1SFarOT3JbKMXAV9qIqJTsWX22	ahmet.gurleyen@flos.com	50	\N
46	ahmetilhanozek	$2b$10$4aq/MMKIw7L6jB7xqkM.iuPTEOj/IjQLu10ZBhq7zXVKk5UmfSWie	ahmet.ilhan.ozek@flos.com	51	\N
47	ahmetkarademir	$2b$10$.NWEW0.eGm1pgZS27oPoEuVnPdU6AdPGtM1IqIesAL418evdk1iBG	ahmet.karademir@flos.com	52	\N
48	ahmetkartal	$2b$10$zv7zrLs41XNtC6scCrKYtOo9FyXT38ZWdvrdhZ3crgba8VJq4OS5O	ahmet.kartal@flos.com	53	\N
49	ahmetkivanc	$2b$10$ZG6ZKz0.L1w7Vrq33QBdmu4SRVREUh18q6ZFZJxLQQMICZbFsjAru	ahmet.kivanc@flos.com	54	\N
50	ahmetoguz	$2b$10$foAdbWpAPin5Xinkpi/uWO4DE7mkvL2YchPnc1O1xyy7BocbEHbUW	ahmet.oguz@flos.com	55	\N
51	ahmetozden	$2b$10$wX47j.RY4aPbj12utRzCouYLet4zyp/z41slKghaFab9.aaXSLGEe	ahmet.ozden@flos.com	56	\N
52	ahmetsun	$2b$10$vZOuuNhgYYf7LHw6uTGfWe3DyQS9n1.x1rLbVD8xYENXtIxYcI9cC	ahmet.sun@flos.com	57	\N
53	ahmetcankaplan	$2b$10$MtUFhjHdjpsY0zUpLgn/Z.agGQKNLTCGAP9OTTaxfeYOYvTR08Trq	ahmetcan.kaplan@flos.com	58	\N
54	akifkaragulmez	$2b$10$ViQ9bET6XL5guQ8o56Idguk5frWeIs2EgqyZ5b60AX3UtjkZuNMQi	akif.karagulmez@flos.com	59	\N
55	akinalkan	$2b$10$vYcIOxVi3PXoPj0b5dXHf.noPB88qh2X71pmIaCrXoFH6lOfpL0Vy	akin.alkan@flos.com	60	\N
56	akselaktas	$2b$10$8BjF55J9cWCe7KFpXjaSnuVXw55mLWXAV4hOPQz4II4CZDBTXqzk2	aksel.aktas@flos.com	61	\N
57	alaaddinokumus	$2b$10$l63sEnVUZrOZUYCmjBnED.SYWQJOTa6XEOnodZ0bJQqMC12VKjd8u	alaaddin.okumus@flos.com	62	\N
58	alberkkoc	$2b$10$94Oik9DLcHVc5aR2vQ7LDOAWx2U0sxE5V.H3.HgWiVzEBhK2jac8a	alberk.koc@flos.com	63	\N
59	aliakman	$2b$10$XLENhKAMX4/5tu.EJ26Bb.BWMWdoN6xmiWkp15I1NqMUpXgOEDC8u	ali.akman@flos.com	64	\N
60	aliates	$2b$10$5CDUmucjxbH.lyL7UFhVo.70EI.rfordAxkqePmzoKJ34VXNBH.CC	ali.ates@flos.com	65	\N
61	alibilgin	$2b$10$8jdVgijv8LQKDLE1j2MwTOl/j5ZsbCtLQyYSIYjmViXtO09ThNkHW	ali.bilgin@flos.com	66	\N
62	alicamdali	$2b$10$cnufrYkUE1q24r3Wyg5pCu0tgsP/7ZnRpDx2VlUoGgjnA.gNDIZgy	ali.camdali@flos.com	67	\N
63	alidemirel	$2b$10$eLXK/WkDIe16SPj5hN4kjuSUKlJVPqHgWWjsxhzoJFzOYqaFFovmy	ali.demirel@flos.com	68	\N
64	alidere	$2b$10$ru4fL6CVZQZpyHUo3vdI3ujrQ.jhk0dW4kaTW3qBp4PXDjjVt/XDO	ali.dere@flos.com	69	\N
65	alidasdemir	$2b$10$snNlNzuFzQCqyIREFfMQuu/D/iUUq6PvzGAbAVHELylDJ0k1rx8Zm	ali.eren.dasdemir@flos.com	70	\N
66	aliiyican	$2b$10$mQblg9cj1oR7K.Htj7fV/O.wp1ss/gqt/vly2bt9a5LNCgWttthvy	ali.eren.iyican@flos.com	71	\N
\.


--
-- TOC entry 3784 (class 0 OID 16745)
-- Dependencies: 235
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
44	\N	Ahmet Çalık	1993-12-11	https://i.goalzz.com/?i=o%2fp%2f107%2f585%2fahmet-yilmaz-calik-1.png	0	0	Between the sticks, that's where you'll find me 🥅. #GoalieGrit
45	\N	Ahmet Canbaz	1996-06-22	https://i.goalzz.com/?i=kdlhf%2fahme.jpg	0	0	On the wing, in full swing! Pace for days 🏃‍♂️💨. #WingCommander
16	\N	İlhan Parlak	1987-01-19	https://i.goalzz.com/?i=o%2fp%2f25%2f545%2f304lhan-parlak-1.png	0	0	📍Izmir, Turkey | ⚽ Midfielder | 💫 Dreaming Big | 🎓Ege University | 🚀 Free-kick Specialist.
17	\N	Şeyhmus Aksu	1989-05-24	https://i.goalzz.com/?i=omar_a%2fturk%2fbelediyespor%2fs_37839_449_2010_2.jpg	0	0	🥅 Master of the net | Goalkeeping is a lifestyle, not just a position | #SafeHands
19	\N	Ümit Aydın	1990-04-23	https://i.goalzz.com/?i=old%2fumit_aydin.jpg	0	0	⚽ Striking fear in goalkeepers' hearts | Always aiming for the top right corner | #StrikerLife
20	\N	Abdulaziz Demircan	1992-11-27	https://i.goalzz.com/?i=omar_a%2feuro%2fkonyaspor%2f2016-08-26_195511.jpg	0	0	The heart of the field 📍| Orchestrator of play | Life is a game of balance | #MidfieldMastermind
21	\N	Cebrail Akbulut	2023-12-29	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa.akbulut.jpg	0	0	Blazing down the wing 🚀 | Speed, skill, strength, and foolish bravery | #WingerWonders
22	\N	Abdulkadir Demir	1994-08-16	https://i.goalzz.com/?i=hitham%2feredivisie_2014%2feredivisie_2015%2fabdulkadir.jpg	0	0	The defensive wall 💪 | Hold the line, never back down | #DefensiveDynamo
23	\N	Abdulkadir Kayalı	1995-01-22	https://i.goalzz.com/?i=o%2fp%2f90%2f351%2fabdulkadir-kayali-1.png	0	0	Full-Back prowess 🛡️ | Got the defence and attack covered | #NeverBackDown
24	\N	Abdulkadir Ömür	1997-12-31	https://i.goalzz.com/?i=o%2fp%2f137%2f228%2fabdulkadir-omur-1.png	0	0	Clearing balls, clearing the path to victory 👊 | Football's janitor cleaning up | #SweeperKeeper
25	\N	Abdulkadir Parmak	1991-05-05	https://i.goalzz.com/?i=o%2fp%2f58%2f699%2fabdulkadir-parmak-1.png	0	0	Dominating in midfield 👟 | It's never just about scoring goals | #PassMaster
26	\N	Abdulkadir Sünger	1989-07-02	https://i.goalzz.com/?i=o%2fp%2f160%2f273%2fabdulkadir-sunger-1.jpg	0	0	Striker instinct ⚽ | Goals are my language | #HatTrickHero
27	\N	Abdulkadir Taşdan	1998-09-20	https://i.goalzz.com/?i=o%2fp%2f160%2f270%2fabdulkadir-tasdan-2.png	0	0	Winger wizard 💥 | Turning defenders since '98 | #WingWarrior
28	\N	Abdulkerim Bardakçı	1993-05-05	https://i.goalzz.com/?i=o%2fp%2f115%2f506%2fabdulkerim-bardakci-1.png	0	0	Steady at the back, stronghold in defence | Winning isn't everything, it's the only thing 💪| #DefendToWin
29	\N	Abdullah Avcı	1992-08-30	https://i.goalzz.com/?i=omar_a%2fturk%2fbelediyespor%2f1377015393-abdullah+avci+(2).jpg	0	0	Goalkeeper at heart, determined to save more than just shots ⚽️| #UltimateSave
46	\N	Ahmet Çelik	1994-05-13	https://i.goalzz.com/?i=o%2fp%2f166%2f158%2fahmet-celik-1.png	0	0	Full-back, full-on! The defender with an attacker's heart 💪. #BothWorlds
47	\N	Ahmet Çolak	1990-08-26	https://i.goalzz.com/?i=o%2fp%2f70%2f958%2fahmet-colak-1.png	0	0	Mastering the middle! Crafty in possession, canny without 🎲. #GamePlayGenius
30	\N	Abdullah Durak	1995-04-15	https://i.goalzz.com/?i=hghf%2fdurak.jpg	0	0	Aiming for the goalpost, shooting for the stars. Striker life ⚽🚀| #AimHigh
31	\N	Abdullah Şahindere	1990-12-12	https://i.goalzz.com/?i=hgfhgfgg%2fabdullah.jpg	0	0	Controlling the game from the heart of the field | Midfield Maestro 🎯 | #MasterPlaymaker
32	\N	Abdullah Yiğitler	1996-01-01	https://i.goalzz.com/?i=o%2fp%2f166%2f838%2fabdullah-yigiter-1.png	0	0	Winger by position, speedster at heart 🏃‍♂️💨 | Making defenders dizzy | #OnTheWing
33	\N	Abdulsamed Damlu	1994-07-20	https://i.goalzz.com/?i=hghf%2f408.jpg	0	0	Striker spirit | Net-seeking missile launching goals ⚽🥅| #StrikeForce
34	\N	Abdurrahim Dursun	1991-02-28	https://i.goalzz.com/?i=o%2fp%2f153%2f760%2fabdurrahim-dursun-1.png	0	0	Fearless between the sticks 🥅 | Surrender is not in my lexicon | #GuardingTheGoal
35	\N	Abdurrahman Canlı	1989-10-31	https://i.goalzz.com/?i=o%2fp%2f157%2f137%2fabdurrahman-canli-1.png	0	0	Dominating the wing, owning the sprint | Pace is power 🚀| #DownTheLine
36	\N	Abdussamed Karnucu	1992-06-15	https://i.goalzz.com/?i=medalss%2f22.jpg	0	0	Full-back with a forward's ambition | Offence wins games, defence wins championships 🛡️| #FullBackFullFrontal
37	\N	Adem Ağaoğlu	1990-03-25	https://i.goalzz.com/?i=o%2fp%2f163%2f239%2fadem-agaoglu-1.png	0	0	Midfield maestro, playmaker extraordinaire | Pass like Picasso 🎨| #PositionOfPower
38	\N	Adem Buyuk	1992-11-18	https://i.goalzz.com/?i=o%2fp%2f90%2f875%2fadem-buyuk-1.png	0	0	Yup, I'm a goalkeeper. No nets broken on my watch! ⚽️| #LifeBetweenSticks
39	\N	Adem Doğan	1994-03-21	https://i.goalzz.com/?i=o%2fp%2f159%2f620%2fadem-dogan-1.jpg	0	0	I'm here for the goals ⚽. Just your everyday lethal finisher! #TopBinsOnly
40	\N	Adem Metin Türk	1988-10-23	https://i.goalzz.com/?i=o%2fp%2f160%2f255%2fadem-metin-turk-1.png	0	0	They call me the midfield marvel 🎯. Keep calm and pass it to Matt. #GameControl
41	\N	Adil Demirbağ	1997-04-06	https://i.goalzz.com/?i=o%2fp%2f159%2f487%2fadil-demirbag-1.png	0	0	Winging it in style 🚀. They see me rolling, they chasing... #FlairOnFlanks
43	\N	Ahmed Kutucu	1991-07-09	https://i.goalzz.com/?i=o%2fp%2f136%2f987%2fahmed-kutucu-1.png	0	0	Striker and proud! Scoring is my kind of conversation ⚽️. #GoalMachine
42	\N	Ahmed Yıldız	1995-02-02	https://i.goalzz.com/?i=o%2fp%2f8%2f98%2fahmed-ildiz-1.jpg	0	0	No pass zone! Defender with the heart of a lion 🛡️. #BackLineBoss
48	\N	Ahmet Demirli	1991-12-20	https://i.goalzz.com/?i=o%2fp%2f160%2f88%2fahmet-hakan-demirli-1.png	0	0	🎯 Kicking balls, nabbing goals. My life's motto? Go big or go goalpost. #StrikerSupreme
49	\N	Ahmet Gülay	1993-05-24	https://i.goalzz.com/?i=o%2fp%2f159%2f418%2fahmet-gulay-1.jpg	0	0	Master puppeteer in the theatre of dreams. I don't pass the ball, I paint with it. #MidfieldArtistry
50	\N	Ahmet Gürleyen	1992-03-11	https://i.goalzz.com/?i=teams%2fgermany%2ffsv_mainz_05_%2fahmet_gurleyen.jpg	0	0	Not all heroes wear capes, some guard net posts. Best goalkeeper this side of the solar system. 🚀 #StarKeeper
51	\N	Ahmet İlhan Özek	1990-02-18	https://i.goalzz.com/?i=o%2fp%2f101%2f940%2fahmet-ilhan-ozek-1.png	0	0	Less like a defender, more like a fortress. Forward attacks? Not on my watch! #BacklineBouncer
52	\N	Ahmet Karademir	1996-04-27	https://i.goalzz.com/?i=o%2fp%2f161%2f573%2fahmet-karademir-1.jpg	0	0	Wings? Check. Wonders down the flank? Double Check. Defenders' nightmare and wingers' aspiration. 💫 #WingerWonderland
53	\N	Ahmet Kartal	1995-06-30	https://i.goalzz.com/?i=o%2fp%2f159%2f624%2fahmet-zekeriyya-kart-1.jpg	0	0	Defense and attack? I've got both on lock. Forward dribblers, you've been warned. #FullbackFearFactor
54	\N	Ahmet Kıvanç	1994-10-08	https://i.goalzz.com/?i=kdlhf%2f1323285.jpg	0	0	Making keepers fear and nets cheer one goal at a time. ⚽️ #StrikerStatement
55	\N	Ahmet Oğuz	1998-01-17	https://i.goalzz.com/?i=o%2fp%2f107%2f599%2fahmet-oguz-1.png	0	0	I dance with danger between two posts. Unstoppable force? Meet the immovable keeper. #KeepingCalm
56	\N	Ahmet Özden	1992-07-16	https://i.goalzz.com/?i=o%2fp%2f115%2f603%2fahmet-ozden-1.png	0	0	Midfield's my stage, football's my script. Pulling the strings between the white lines. #GamePlayGuru
57	\N	Ahmet Sun	1997-11-29	https://i.goalzz.com/?i=o%2fp%2f159%2f459%2fahmet-sun-2.png	0	0	Tear down the wings, that's the motto. Catch me if you can! #SpeedySupremacy
58	\N	Ahmetcan Kaplan	1992-01-23	https://i.goalzz.com/?i=o%2fp%2f159%2f630%2fahmetcan-kaplan-2.png	0	0	Living life one corner kick at a time | Striker born, goal scorer sworn | Once scored a goal from my kitchen ⚽🏠
59	\N	Akif Karagülmez	1994-08-13	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa.karagulmez.jpg	0	0	Joggler of the soccer sphere | Dictating play, making day | Pizza with pineapple enthusiast🍕
60	\N	Akın Alkan	1993-03-31	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa.alkan.jpg	0	0	Keeper of nets & devourer of pizza rolls | Saving is my superpower, what's yours? 🥅🦸‍♂️
61	\N	Aksel Aktaş	1991-05-11	https://i.goalzz.com/?i=505%2faksel.jpg	0	0	Nerd by day, defender by night | Providing concrete defense since 1991 🏰💪
62	\N	Alaaddin Okumus	1996-02-02	https://i.goalzz.com/?i=o%2fp%2f162%2f779%2falaaddin-okumus-1.jpg	0	0	Channeling my inner Usain Bolt on the flanks | Winger on the field, movie junkie off it 🎬🏃‍♂️
63	\N	Alberk Koç	1995-10-12	https://i.goalzz.com/?i=o%2fp%2f157%2f292%2falberk-koc-1.jpg	0	0	Equal parts defends, equal parts distracts | I run faster than your WiFi 🏃‍♂️📶
64	\N	Ali Akman	1993-04-08	https://i.goalzz.com/?i=o%2fp%2f144%2f553%2fali-akman-1.png	0	0	I speak three languages - English, Football, and Goals | Aspiring to invent teleportation ⚽🔬
65	\N	Ali Ateş	1990-11-19	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2faliates.jpg	0	0	Keeper extraordinaire, master jam donut eater | Do stuntmen play football? They do now! 🎥⚽️
66	\N	Ali Bilgin	1992-07-30	https://i.goalzz.com/?i=imad%2fbilgin.jpg	0	0	Morphing the mundane midfield into a magical mayhem | Part-time Jedi, full-time juggling sensation 🪄⚽️
67	\N	Ali Çamdalı	1997-09-15	https://i.goalzz.com/?i=hazzard%2fali.jpg	0	0	Whizzing down the flank faster than last season's gossip. Winger by day, stargazer by night🌟⚽️
68	\N	Ali Demirel	1993-06-05	https://i.goalzz.com/?i=o%2fp%2f173%2f81%2fali-demirel-1.png	0	0	Swapping vampire novels for saving goals 🧛‍♂️🥅 | Hailed as 'The Last Stand' in hangman's town
69	\N	Ali Dere	1991-07-12	https://i.goalzz.com/?i=omar_a%2feuro%2fkonyaspor%2f2016-08-26_195059.jpg	0	0	Scoring goals while napping 😴⚽ | Master of the unpredictable curler | Part-time cloud whisperer ☁️
70	\N	Ali Eren Daşdemir	1992-02-15	https://i.goalzz.com/?i=o%2fp%2f157%2f284%2fali-eren-dasdemir-1.jpg	0	0	⛔ No entry zone! Defender with the heart of a novelist 🖊️ | Once found Atlantis on a casual jog 🏃
71	\N	Ali Eren İyican	1997-11-06	https://i.goalzz.com/?i=o%2fp%2f160%2f254%2fali-eren-iyican-1.png	0	0	Blazing the wing like a misplaced comet ☄️ | Caution: Contains high levels of speed 🚀 | Soccer enthusiast, taco connoisseur 🌮
\.


--
-- TOC entry 3771 (class 0 OID 16522)
-- Dependencies: 220
-- Data for Name: Referee; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Referee" ("refereeId", "fullName", birthday, email, "imgPath", "licenseType") FROM stdin;
42	İsmail Sencan	1978-03-20	i.sencan@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f217%2fismail-sencan-1.jpg	Category C
43	Serkan Çimen	1990-02-07	serkan.cimen@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f541%2fserkan-cimen-1.jpg	Category C
44	Melton Webb	1984-08-14	melton.webb@flos.com	https://i.goalzz.com/?i=epa%2fsoccer%2f2008-04%2f2008-04-17%2f2008-04-17-00000301317421.jpg	Category B
6	Arda Kardeşler	1988-06-14	a.kardesler@flos.com	https://i.goalzz.com/?i=o%2fr%2f5%2f390%2farda-kardesler-1.jpg	Category FIFA
7	Alper Çetin	1991-02-12	alper.cetin@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f240%2falper-cetin-1.jpg	Category A
8	Bahattin Şimşek	1990-04-18	bahattin.simsek@flos.com	https://i.goalzz.com/?i=00mohamed%40%2f%40mexico%2f266852.jpg	Category S
9	Barış Şimşek	1976-10-12	baris.simsek@flos.com	https://i.goalzz.com/?i=-vitchmen-%2fsimsik.jpg	Category A
11	Bülent Birincioğlu	1987-01-23	b.birincioglu@flos.com	https://i.goalzz.com/?i=o%2fr%2f5%2f294%2fbulent-birincioglu-1.jpg	Category C
12	Burak Pekkan	1993-06-28	burak.pekkan@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f239%2fburak-pakkan-1.jpg	Category S
13	Burak Şeker	1987-12-13	burak.seker@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f121%2fburak-sugar-1.jpg	Category B
14	Çağdaş Altay	1979-01-18	cagdas.altay@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f238%2fcagdas-altay-1.jpg	Category C
15	Çeliker Özkan	1990-03-20	celiker.ozkan@flos.com	https://i.goalzz.com/?i=younes1%2fceliker+ozkan.jpg	Category C
16	Cihan Aydın	1994-07-03	cihan.aydin@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f133%2fcihan-aydin-1.jpg	Category S
17	Coşkun İlker	1986-08-31	coskun.ilker@flos.com	https://i.goalzz.com/?i=younes1%2fmustafa+ilker.jpg	Category B
18	Davut Çelik	1991-05-26	davut.celik@flos.com	https://i.goalzz.com/?i=o%2fr%2f6%2f30%2fdavut-dakul-celik-1.jpg	Category C
19	Emre Kargın	1995-11-01	emre.kargin@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f222%2femre-kargin-1.jpg	Category B
20	Emre Malok	1985-03-15	emre.malok@flos.com	https://i.goalzz.com/?i=katkotati%2freference%2ftur%2femre+malok.jpg	Category B
21	Erkan Özdamar	1996-05-23	erkan.ozdamaer@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f134%2ferkan-ozdamar-1.jpg	Category S
22	Furkan Aksuoğlu	1997-09-13	f.aksuoglu@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f720%2ffurkan-aksuoglu-1.jpg	Category C
23	Gamze Pekkan	1992-05-19	g.durmus.pekkan@flos.com	https://i.goalzz.com/?i=o%2fr%2f8%2f440%2fgamze-durmus-pakkan-1.jpg	Category B
24	Gürcan Hasova	1994-02-07	gurcan.hasove@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f710%2fgurcan-hasova-1.jpg	Category C
26	Kadir Sağlam	1991-06-02	kadir.saglam@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f135%2fkadir-saglam-1.jpg	Category S
27	Koray Gencerler	1985-03-17	koray.gencerler@flos.com	https://i.goalzz.com/?i=o%2fr%2f6%2f651%2fkoray-gencerler-1.jpg	Category S
28	Kuddusi Müftüoğlu	1984-08-31	k.muftuoglu@flos.com	https://i.goalzz.com/?i=youness2%2f18433.jpg	Category C
29	Kutluhan Bilgiç	1986-11-02	k.bilgic@flos.com	https://i.goalzz.com/?i=o%2fr%2f5%2f408%2fkutluhan-bilgic-1.jpg	Category B
30	Melis Özçiğdem	1982-06-27	m.ozcigdem@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f363%2fmeliz-ozcigdem-1.jpg	Category A
31	Mustafa Filiz	1996-01-08	mustafa.filiz@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f221%2fmustafa-kursad-filiz-1.jpg	Category A
32	Oğuzhan Aksu	1990-11-11	oguzhan.aksu@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f936%2fneslihan-muratdagi-1.jpg	Category C
33	Oğuzhan Çakır	1997-05-10	oguzhan.cakir@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f691%2foguzhan-cakir-1.jpg	Category A
34	Onur Özütoprak	1998-02-06	onur.ozutoprak@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f132%2fonur-ozutoprak-1.jpg	Category C
35	Raşit Yorgancılar	1987-09-18	r.yorgancilar@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f719%2frasit-yorgancilar-1.jpg	Category B
36	Sarperbarış Saka	1984-03-04	s.saka@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f119%2fsarper-baris-saka-2.jpg	Category S
37	Turgut Doman	1992-06-28	turgut.doman@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f259%2fturgut-doman-1.jpg	Category A
38	Ümit Öztürk	1987-04-14	umit.ozturk@flos.com	https://img.a.transfermarkt.technology/portrait/big/9552-1591989293.jpeg?lm=1	Category FIFA
39	Yasin Kol	1988-09-09	yasin.kol@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f219%2fyasin-kol-1.jpg	Category S
40	Yunus Yıldırım	2023-12-20	yunus.yildirim@flos.com	https://i.goalzz.com/?i=youness2%2f18287.jpg	Category B
41	Hakan Yemişken	1984-05-28	h.yemisken@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f218%2fhakan-yemisken-1.jpg	Category C
45	Fatih Necmi	1991-03-12	fatih.necmi@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f122%2fjohn-brooks-1.jpg	Category B
46	Rodrigo Emmanuel	1989-02-05	r.emmanuel@flos.com	https://i.goalzz.com/?i=o%2fr%2f4%2f293%2fadrian-cordero-vega-1.jpg	Category C
47	Pelin Şah	2000-06-02	pelin.sah@flos.com	https://i.goalzz.com/?i=00mohamed%40%2fmlaeb%2f112112.jpg	Category B
48	Şükrü Korkut	1987-04-13	sukru.korkut@flos.com	https://i.goalzz.com/?i=jawharanet%2farbitros%2fundiano_mallenco.jpg	Category A
49	Furkan Kaplan	1992-11-30	furkan.kaplan@flos.com	https://i.goalzz.com/?i=o%2fr%2f2%2f527%2falejandro-jose-herna-1.jpg	Category C
50	Hakan Soylu	1990-02-10	hakan.soylu@flos.com	https://i.goalzz.com/?i=o%2fr%2f7%2f927%2falejandro-muniz-ruiz-2.jpg	Category B
52	Kazım Muhbir	1993-08-08	kazim.muhbir@flos.com	https://i.goalzz.com/?i=jawharanet%2farbitros%2fcarlos+del+cerro+grande.jpg	Category C
53	Kutsi Makam	1984-02-28	kutsi.makam@flos.com	https://i.goalzz.com/?i=o%2fr%2f1%2f281%2fcesar-soto-grado-2.jpg	Category B
54	Berkay Yanbasan	1998-09-30	b.yanbasan@flos.com	https://i.goalzz.com/?i=o%2fr%2f8%2f421%2ffrancisco-jose-herna-1.jpg	Category C
55	Atıf Vecip	1982-12-12	atıf.vecip@flos.com	https://i.goalzz.com/?i=o%2fr%2f5%2f344%2fguillermo-cuadra-fer-1.jpg	Category B
56	Yeliz Yemiş	1985-01-22	yeliz.yemis@flos.com	https://i.goalzz.com/?i=o%2fr%2f8%2f89%2fmaria-eugenia-gil-1.jpg	Category A
57	Harun Ters	1988-08-29	harun.ters@flos.com	https://i.goalzz.com/?i=youness2%2fjose-luis-gonzalez-gonzalez.jpg	Category C
51	Zeynep Kutlu	2023-02-28	zeynep.kutlu@flos.com	https://i.goalzz.com/?i=00mohamed%40%2fmlaeb%2f22.jpg	Category C
\.


--
-- TOC entry 3781 (class 0 OID 16693)
-- Dependencies: 232
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
27	Beylerbeyi 75. Yıl FS	1825	Beylerbeyi, Beybostanı Sk., 34676 Üsküdar/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipPZQ0NsYcLjOIteQzzl1k0-aaR0PX1zMbTVXDGA=s680-w680-h510	beylerbeyi.75.fs@flos.com
28	Adalar Futbol Sahası	258	Büyükada-nizam, 34970 Adalar/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipPvg5odfgxkhwB8SVk3mYDoOWsxkEKEtmK8gQs=s680-w680-h510	adalar.fs@flos.com
29	Çigli BS Sahası	901	Yeni Mahalle, 8041. Sk. No:49, 35620 Çiğli/İzmir, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOxBEFOnDYQTiKAr9VsnlMt6DcDw7RDSksR39fz=s680-w680-h510	cigli.bs.sahasi@flos.com
30	Menemen BS Stadı	2456	Kazımpaşa, 1212. Sk. No:4, 35660 Menemen/İzmir, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNIQVkIe-80y0fXqgMM-vF8MGgsTAsrLo0WDxnl=s680-w680-h510	menemen.bs.stadi@flos.com
31	Sultanbeyli Bel. FS	1642	Mehmet Akif, Rümeysa Sk. No:14, 34920 Sultanbeyli/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNR8dnJM1BGOxtaCyg7IEPnoZyU-wONp1R6MIW5=s680-w680-h510	sultanbeyli.bel.fs@flos.com
32	Darıca Gençler FS	1089	Bağlarbaşı, Bağlarbaşı Mah. İstasyon cad, Özbay Sk. No:79, 41700 Darıca/Kocaeli, Türkiye	https://lh3.googleusercontent.com/p/AF1QipO09my0ij6-6ga2IGaOwf6yQ-kEZzAFEsRRku1-=s680-w680-h510	darica.gencler.fs@flos.com
8	Futbol Merkezi HS	107	Barbaros, Water Garden Karşısı, Mor Sumbul Sokagi no:4, 34750 Ataşehir/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOEh-7Zf5vZStphtbQAHlYqR2C0OB3l2hnVVy7S=s680-w680-h510	futbol.merkezi.hs@flos.com
7	Şahlanlar Sportland	285	Buca Koop., 220/71. Sk. no 7, 35390 Buca/İzmir, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOzb1iZSt0sMqSz7G50azJc3g4vSCckQXHGuoql=s680-w680-h510	sahlanlar.sportland@flos.com
9	Orman Park Tesisleri	151	Nişantepe, Saray Cd. No:319, 34794 Çekmeköy/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipORx14JiQT8YATi4MEY-_pSOvPy_8BlfEqitYME=s680-w680-h510	orman.park.ts@flos.com
10	Yılmazlar HS	174	Yeni mahalle, Şht. Ali Raif Özbek Cd. no: 52, 81850 Gümüşova/Düzce, Türkiye	https://lh3.googleusercontent.com/p/AF1QipMSzxlEvzG_q0czLOIMONXG-shL41_v5MKz3yPY=s680-w680-h510	yilmazlar.hs@flos.com
11	Yozgat Tugay HS	64	Şeyh Osman, 66000 Merkez/Yozgat, Türkiye	https://lh3.googleusercontent.com/p/AF1QipN95dnS2uc3FNmUkcHmOk_zNRLpFsVy2GLnRPKv=s680-w680-h510	yozgat.tugay.hs@flos.com
12	Öztürkler Spor Tesisi	97	Alibeyköy, Nihan Sk. no:14/2, 34060 Eyüpsultan/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNQFjmAudHxx_ceO2kP8uBVKBNwD_cHBF2pr5c0=s680-w680-h510	ozturkler.spor.ts@flos.com
13	Çobanyıldızı HS	342	Barakfakih, 16450 Kestel/Bursa, Türkiye	https://www.kozacadir.com/Upload/Dosyalar/resim-jpg/hali-saha-4-2c3903cd-6ee7-4397-a394-051d008d6533.jpg	cobanyildizi.hs@flos.com
14	Göksu Arena Tesisleri	184	Göztepe Mah Göztepe Yolu No:13 Anadoluhisarı, 34810 Beykoz/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOdzPLP9EH-pS15FwUp5-rtAnQS9kuyRzoaekon=s680-w680-h510	goksu.arena.ts@flos.com
15	M. Kemal Paşa HS	98	Cihangir, Osman Özberk Park İçi Yolu, 34310 Avcılar/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipMjaTZQ7kZ2ECnVVbePB4a6e_EDalKYvCUupHEt=s680-w680-h510	m.kemal.pasa.hs@flos.com
16	Altay Okay HS	417	Gazikent mah.Gazi Atatürk blv, Altay Spor Tesisleri 10/1, 35500 Gaziemir/İzmir, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOFA9UdLg_DKOERaz5Jg-6VEF4Xi7V9gPehKk-f=s680-w680-h510	altay.okay.hs@flos.com
17	Dragos Halı Sahaları	712	Yalı Mahallesi Fethiye Caddesi No 19 Dragos, 34844 Maltepe/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNdKfuprgOcQt-mD5kIU7m24HL2gFKLGF5xXHtC=s680-w680-h510	dragos.hs@flos.com
18	Doğa Park HS	300	Fatih Sultan Mehmet, Mehmet Akif Ersoy Cd. No:123, 34764 Ümraniye/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipPJp7_OMjoMgRwTLb8ynRF1lYw6xAOpI7C18e4P=s680-w680-h510	doga.park.hs@flos.com
33	Tuzla Stadium	1287	İçmeler, Bülbül Sok. No:37, 34947 Tuzla/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOkFTtlP-rdEAwqI2AUiCuOP7KmP_9i1XFXPrFz=s680-w680-h510	tuzla.stadium@flos.com
20	Küçükçekmece İY Tesisi	298	Atakent, 4. Cd. 39/A, 34307 Küçükçekmece/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipP30DBboG7w7Ls5x3-VmfWhHWXfURsZqbJGXqvQ=s680-w680-h510	kucukcekmece.iy.ts@flos.com
19	Edirnekapi Surdibi HS	510	Defterdar, Savaklar Cd. No:6, 34050 Eyüpsultan/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipM-0xNpyf2cHTk88RGc1Ng_tM4gvtBhfEd9SLMj=s680-w680-h510	edirnekapi.hs@flos.com
21	İstanbul Trabzonspor TS	1461	Atakent, 4. Cd. No: 39, 34307 Küçükçekmece/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipPPpKUeinExiucNWlPF2zYAvNPhiuBHzQTvg35P=s680-w680-h510	istanbul.trabzonspor@flos.com
22	Ring Football Stadium	924	Atakent Mah., 4. Cad., 34303 Küçükçekmece/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipPciY61b9-BRRuP2_qahtADmeM7pxYVEFf2HnA=s680-w680-h510	ring.fs@flos.com
23	Kilyos Futbol Stadı	824	Kumköy, Demirciköy Cd. No:286, 34450 Sarıyer/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOrUFe_tjmRP8TRZaCmXIUPEmNv-kME_jIhmK9L=s680-w680-h510	kilyos.fs@flos.com
24	Gebze Metin Oktay FS	1326	Güzeller, 41400 Gebze/Kocaeli, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOuyVLBpaMpCrpf8H9P1uwSoQzxJms-71b18FVd=s680-w680-h510	gebze.metin.oktay@flos.com
25	Tuzla Yüksektepe FS	875	Orta, Sabancı Ünv. No:86, 34956 Tuzla/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipN-KTqnnFhGAIpr_J7XbQTtzRF0lNcdh6XVPWWM=s680-w680-h510	tuzla.yuksektepe@flos.com
26	Summerhouse Stadium	1159	Çamlık, Erguvan Sokağı, 34912 Pendik/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOTYgrTvCRgiB72kuc9x_oyUZCww6xkKkEqR1A_=s680-w680-h510	summerhouse.stadium@flos.com
34	Gaziosmanpaşa Stadı	2759	Merkez, 3. Selvi Çk. No:3, 34245 Gaziosmanpaşa/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipObFwlU7i2pp8eO04NQ4JUiOzuXsGimY_XnfzMZ=s680-w680-h510	gaziosmanpasa@flos.com
35	Esenler Stadyumu	12792	Kemer, 949/1. Çk. No:4, 34230 Esenler/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOk1EQUXJkz6nsBNY_s818fmWEsAOTEUlx4FPLw=s680-w680-h510	esenler.stadium@flos.com
36	Bahçelievler Stadı	4100	Fevziçakmak, Çakmak Sk., 34194 Bahçelievler/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNVcprS3kxj5pTZf_MKvkdEJG2N132AX5MYriU8=s680-w680-h510	bahcelievler.stadi@flos.com
37	Mimar Sinan Stadyumu	1250	Karagümrük, Keçeci Meydanı Sk. No:13, 34091 Fatih/İstanbul, 	https://lh3.googleusercontent.com/p/AF1QipMQLJyIVztNNZr4o2miFKt2eEoe1xH9yZSG-i6F=s680-w680-h510	mimar.sinan.sy@flos.com
38	Eyüp Stadyumu	2719	İslambey, Halitpaşa Cd. No:80, 34050 Eyüpsultan/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNExNZctpHs_EsX-rPKPjl57sWO13r6Yvnpmfpn=s680-w680-h510	eyup.stadyumu@flos.com
39	Halit Kıvanç Stadi	14296	Mevlana, 868/874 sokak, 34250 Gaziosmanpaşa/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOwAOWcdkUQP5AvoVBbXLdOUR6QXY_qAsuZ6b_6=s680-w680-h510	halit.kivanc@flos.com
41	Kasımpaşa Stadyumu	16267	Çatma Mescit, Refik Saydam Cd., 34430 Beyoğlu/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipP8BMY7fwcrAkDxELdX3tWLfrP3hLAyx_AFgEBG=s680-w680-h510	kasımpasa.std@flos.com
42	Vefa Stadı	12892	Dervişali, 34087 Fatih/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNCEDanqdDiumqT6-cl4jIWaxm582xkcknAKuIq=s680-w680-h510	vefa.std@flos.com
43	Ümraniye Şehir Stadı	3513	İnkılap, Hekimbaşı Spor Tesisleri, 34768 Ümraniye/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipPAGIvIZwHDQjg0um3FJ6rpdb36r6U5AC9SdzjI=s680-w680-h510	umraniye.sehir@flos.com
44	ODTÜ Devrim Stadı	7899	Üniversiteler, 06800 Çankaya/Ankara, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNSgHmZEOIqdUOuiNNM87KG21-w3AHBCmkkl2Oh=s680-w680-h510	odtu.edu@flos.com
45	Antakya Atatürk Stadı	11150	General Şükrü Kanatlı, 19 Mayıs Caddesi No:4, 31030 Altındağ/Ankara, Türkiye	https://lh3.googleusercontent.com/p/AF1QipO5XSACE8GycBgGNDV2uaNlOprwjriu-ZVGQZx2=s680-w680-h510	ankara.antakya.std@flos.com
46	Etimesgut Atatürk FS	9267	30 Ağustos, Şehitler Cd. No:47, 06790 Etimesgut/Ankara, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNgayAZKgRVO3ysARnBFU08SBo8UC2Jo--jtszy=s680-w680-h510	etimesgut.ataturk@flos.com
47	Aktepe Stadium	5000	Adnan Menderes, 30, Şht. Hakan Ülger Sk., 06300 Keçiören/Ankara, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNZ275Q_FibfY8ZTiu2aRI7EPLBz1yvCGM_U2K3=s680-w680-h510	aktepe.std@flos.com
48	19 Mayıs Stadyum	19209	Anafartalar, Cumhuriyet Cd., 06050 Altındağ/Ankara, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNw-kYuDuNbpO8NKH7Y_5y-bwlnZrBcvDi1zHp6=s680-w680-h510	19.mayis.std@flos.com
49	Mamak Şehir Stadyum	7492	Türközü, 435/8. Sk. No:20, 06630 Mamak/Ankara, Türkiye	https://lh3.googleusercontent.com/p/AF1QipMVpa1L1XiB0d2zRXtfQaqAEQKRQQmiezojolsH=s680-w680-h510	mamak.bel@flos.com
51	Bafra Stadyumu	6273	Samsun 2017 - Bafra Stadium, Sancak Sk. Fatih Mahallesi, 55400 Bafra/Samsun, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNNr9BoqykhMKEXuoqZM0ZC4EJKS7WyKJEj2ZzF=s680-w680-h510	bafra.std@flos.com
50	Samsun 19 Mayıs Stadı	33919	Sanayi, Yeni Samsun 19 Mayıs Stadyumu, Bakır Sitesi Cd. No:1, 55300 Tekkeköy/Samsun, Türkiye	https://lh3.googleusercontent.com/p/AF1QipN2i849f9SdV01JBKScPnfY_royGW9Kzm-RyCjI=s680-w680-h510	samsunspor@flos.com
52	Corendon Antalya Stadı	32539	Meltem, 3802. Sk., 07030 Muratpaşa/Antalya, Türkiye	https://lh3.googleusercontent.com/p/AF1QipMgEzFhReLEfrZy1ciWpROlGUao-rC_thqs08pI=s680-w680-h510	antalyaspor@flos.com
53	Buca Stadyumu	8810	Cumhuriyet, 1251. Sk. No:4, 35400 Buca/İzmir, Türkiye	https://lh3.googleusercontent.com/p/AF1QipMkfL5nDp-gINtFVSIvG8udjOhvKLkgkXpBmP7T=s680-w680-h510	buca.bel@flos.com
54	Alsancak Stadyumu	15000	Halkapınar, Şehitler Cd., 35220 Konak/İzmir, Türkiye	https://lh3.googleusercontent.com/p/AF1QipNstiQE0Cwcf5UVzqfCID2CPtqUiHbZ2zl-qoCT=s680-w680-h510	alsancak.bel@flos.com
55	Kocaeli Stadyumu	34712	Alikahya Atatürk, Tunaoğlu Cad., 41310 İzmit/Kocaeli, Türkiye	https://lh3.googleusercontent.com/p/AF1QipOwP2qD_F1Y_ZdKU2azDMNGqxlceDMUqfiJjhjA=s680-w680-h510	kocaeli.bel@flos.com
56	Sakarya Atatürk Stadı	28154	Yağcılar, 54100 Adapazarı/Sakarya, Türkiye	https://lh3.googleusercontent.com/p/AF1QipP1FvEwHZVnfF00u8FppG1dMPj8DEuN6SdQky3g=s680-w680-h510	sakarya.bel@flos.com
57	Fatih Terim Stadyumu	17319	Başak, 4.Etap Fatih Teri̇m Stadı Başakşehir, Yunus Emre Cd., 34480 Başakşehir/İstanbul, Türkiye	https://lh3.googleusercontent.com/p/AF1QipPmZyPLUBt_1aDeClobq0zqETY1PCwyPGC5Oe2H=s680-w680-h510	basaksehir.fk@flos.com
\.


--
-- TOC entry 3799 (class 0 OID 0)
-- Dependencies: 230
-- Name: Club_clubId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Club_clubId_seq"', 15, true);


--
-- TOC entry 3800 (class 0 OID 0)
-- Dependencies: 233
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

SELECT pg_catalog.setval('public."Organizer_organizerId_seq"', 55, true);


--
-- TOC entry 3804 (class 0 OID 0)
-- Dependencies: 217
-- Name: Participant_participantId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Participant_participantId_seq"', 66, true);


--
-- TOC entry 3805 (class 0 OID 0)
-- Dependencies: 226
-- Name: Player_playerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Player_playerId_seq"', 71, true);


--
-- TOC entry 3806 (class 0 OID 0)
-- Dependencies: 219
-- Name: Referee_refereeId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Referee_refereeId_seq"', 57, true);


--
-- TOC entry 3807 (class 0 OID 0)
-- Dependencies: 221
-- Name: Venue_venueId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Venue_venueId_seq"', 57, true);


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


-- Completed on 2023-12-29 20:40:55 +03

--
-- PostgreSQL database dump complete
--

