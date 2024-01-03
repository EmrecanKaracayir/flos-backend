--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-01-03 23:45:41 +03

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
-- TOC entry 913 (class 1247 OID 16792)
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
-- TOC entry 919 (class 1247 OID 16896)
-- Name: FixtureState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."FixtureState" AS ENUM (
    'Not played',
    'Played'
);


ALTER TYPE public."FixtureState" OWNER TO "Emrecan";

--
-- TOC entry 899 (class 1247 OID 16607)
-- Name: LeagueState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."LeagueState" AS ENUM (
    'Not started',
    'In progress',
    'Finished'
);


ALTER TYPE public."LeagueState" OWNER TO "Emrecan";

--
-- TOC entry 902 (class 1247 OID 16615)
-- Name: PlayerState; Type: TYPE; Schema: public; Owner: Emrecan
--

CREATE TYPE public."PlayerState" AS ENUM (
    'Available',
    'In a club'
);


ALTER TYPE public."PlayerState" OWNER TO "Emrecan";

--
-- TOC entry 905 (class 1247 OID 16595)
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

--
-- TOC entry 246 (class 1255 OID 16902)
-- Name: getClubRank(integer, integer); Type: FUNCTION; Schema: public; Owner: Emrecan
--

CREATE FUNCTION public."getClubRank"("_leagueId" integer, "_clubId" integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    "clubRank" integer;
BEGIN
    SELECT rank
    INTO "clubRank"
    FROM (
        SELECT S."clubId", S."leagueId",
        ROW_NUMBER() OVER(PARTITION BY S."leagueId" ORDER BY ("winCount" * 3 + "drawCount") DESC, (scored - conceded) DESC, C."name") as rank
        FROM public."Statistics" S
        JOIN "Club" C on S."clubId" = C."clubId"
    ) AS Stats
    WHERE "leagueId" = "_leagueId" AND "clubId" = "_clubId";

    RETURN "clubRank";
END
$$;


ALTER FUNCTION public."getClubRank"("_leagueId" integer, "_clubId" integer) OWNER TO "Emrecan";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 16674)
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
-- TOC entry 243 (class 1259 OID 16976)
-- Name: ClubView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."ClubView" AS
 SELECT "Club"."clubId",
    "League".name AS "leagueName",
    "Club".name,
        CASE
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count >= 7)) THEN 'Ready'::public."ClubState"
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
-- TOC entry 229 (class 1259 OID 16673)
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
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 229
-- Name: Club_clubId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Club_clubId_seq" OWNED BY public."Club"."clubId";


--
-- TOC entry 233 (class 1259 OID 16714)
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
-- TOC entry 236 (class 1259 OID 16920)
-- Name: FixtureView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."FixtureView" AS
 SELECT f."fixtureId",
    f."leagueId",
    l.name AS "leagueName",
    f."homeClubId",
    f."awayClubId",
    h.name AS "homeClubName",
    a.name AS "awayClubName",
    public."getClubRank"(f."leagueId", f."homeClubId") AS "homeClubRank",
    public."getClubRank"(f."leagueId", f."awayClubId") AS "awayClubRank",
    h."logoPath" AS "homeClubLogoPath",
    a."logoPath" AS "awayClubLogoPath",
    f."homeTeamScore",
    f."awayTeamScore",
    f.week,
    f."refereeId",
    r."fullName" AS "refereeName",
    f."venueId",
    v.name AS "venueName",
        CASE
            WHEN ((f."homeTeamScore" IS NULL) OR (f."awayTeamScore" IS NULL)) THEN 'Not played'::public."FixtureState"
            ELSE 'Played'::public."FixtureState"
        END AS state
   FROM (((((public."Fixture" f
     JOIN public."League" l ON ((f."leagueId" = l."leagueId")))
     JOIN public."Club" h ON ((f."homeClubId" = h."clubId")))
     JOIN public."Club" a ON ((f."awayClubId" = a."clubId")))
     JOIN public."Referee" r ON ((f."refereeId" = r."refereeId")))
     JOIN public."Venue" v ON ((f."venueId" = v."venueId")));


ALTER VIEW public."FixtureView" OWNER TO "Emrecan";

--
-- TOC entry 232 (class 1259 OID 16713)
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
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 232
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
-- TOC entry 241 (class 1259 OID 16968)
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
-- TOC entry 3816 (class 0 OID 0)
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
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 224
-- Name: League_organizerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."League_organizerId_seq" OWNED BY public."League"."organizerId";


--
-- TOC entry 234 (class 1259 OID 16745)
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
-- TOC entry 240 (class 1259 OID 16942)
-- Name: MyClubPlayerView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyClubPlayerView" AS
 SELECT "Player"."playerId",
    "Club"."clubId",
    "Club".name AS "clubName",
    "Player"."fullName",
    (EXTRACT(year FROM age(("Player".birthday)::timestamp with time zone)))::integer AS age,
    ( SELECT COALESCE(sum("Performance"."goalCount"), (0)::bigint) AS sum
           FROM public."Performance"
          WHERE ("Performance"."playerId" = "Player"."playerId")) AS goals,
    ( SELECT COALESCE(sum("Performance"."assistCount"), (0)::bigint) AS sum
           FROM public."Performance"
          WHERE ("Performance"."playerId" = "Player"."playerId")) AS assists,
    "Participant".email AS "participantEmail",
    "Player".biography,
    "Player"."imgPath",
        CASE
            WHEN ("Player"."clubId" IS NULL) THEN 'Available'::public."PlayerState"
            ELSE 'In a club'::public."PlayerState"
        END AS state
   FROM ((public."Player"
     JOIN public."Participant" ON (("Player"."playerId" = "Participant"."playerId")))
     LEFT JOIN public."Club" ON (("Player"."clubId" = "Club"."clubId")))
  ORDER BY "Player".goals DESC;


ALTER VIEW public."MyClubPlayerView" OWNER TO "Emrecan";

--
-- TOC entry 244 (class 1259 OID 16981)
-- Name: MyClubView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyClubView" AS
 SELECT "Club"."clubId",
    "Participant"."participantId",
    "League".name AS "leagueName",
    "Club".name,
        CASE
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count >= 7)) THEN 'Ready'::public."ClubState"
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
-- TOC entry 237 (class 1259 OID 16925)
-- Name: MyFixtureView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyFixtureView" AS
 SELECT f."fixtureId",
    l."organizerId",
    f."leagueId",
    l.name AS "leagueName",
    f."homeClubId",
    f."awayClubId",
    h.name AS "homeClubName",
    a.name AS "awayClubName",
    public."getClubRank"(f."leagueId", f."homeClubId") AS "homeClubRank",
    public."getClubRank"(f."leagueId", f."awayClubId") AS "awayClubRank",
    h."logoPath" AS "homeClubLogoPath",
    a."logoPath" AS "awayClubLogoPath",
    f."homeTeamScore",
    f."awayTeamScore",
    f.week,
    f."refereeId",
    r."fullName" AS "refereeName",
    f."venueId",
    v.name AS "venueName",
        CASE
            WHEN ((f."homeTeamScore" IS NULL) OR (f."awayTeamScore" IS NULL)) THEN 'Not played'::public."FixtureState"
            ELSE 'Played'::public."FixtureState"
        END AS state
   FROM (((((public."Fixture" f
     JOIN public."League" l ON ((f."leagueId" = l."leagueId")))
     JOIN public."Club" h ON ((f."homeClubId" = h."clubId")))
     JOIN public."Club" a ON ((f."awayClubId" = a."clubId")))
     JOIN public."Referee" r ON ((f."refereeId" = r."refereeId")))
     JOIN public."Venue" v ON ((f."venueId" = v."venueId")))
  ORDER BY f.week;


ALTER VIEW public."MyFixtureView" OWNER TO "Emrecan";

--
-- TOC entry 231 (class 1259 OID 16693)
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
-- TOC entry 245 (class 1259 OID 16986)
-- Name: MyLeagueClubView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyLeagueClubView" AS
 SELECT "Club"."clubId",
    "League"."leagueId",
    "League".name AS "leagueName",
    "Club".name,
        CASE
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count >= 7)) THEN 'Ready'::public."ClubState"
            WHEN (("Club"."leagueId" IS NULL) AND ("playerByClub".count < 7)) THEN 'Not ready'::public."ClubState"
            WHEN (("Club"."leagueId" IS NOT NULL) AND ("League".state = 'Not started'::public."LeagueState")) THEN 'Signed'::public."ClubState"
            ELSE 'In a league'::public."ClubState"
        END AS state,
    "playerByClub".count AS "playerCount",
    "Club"."cupCount",
    "Participant".email AS "participantEmail",
    "Club".description,
    "Club"."logoPath",
    COALESCE((("Statistics"."winCount" + "Statistics"."drawCount") + "Statistics"."loseCount"), 0) AS played,
    COALESCE("Statistics"."winCount", 0) AS wins,
    COALESCE("Statistics"."drawCount", 0) AS draws,
    COALESCE("Statistics"."loseCount", 0) AS losses,
    COALESCE(("Statistics".scored - "Statistics".conceded), 0) AS average,
    COALESCE((("Statistics"."winCount" * 3) + "Statistics"."drawCount"), 0) AS points
   FROM ((((public."Club"
     JOIN public."Participant" ON (("Club"."clubId" = "Participant"."clubId")))
     LEFT JOIN ( SELECT "Player"."clubId",
            count(*) AS count
           FROM public."Player"
          GROUP BY "Player"."clubId") "playerByClub" ON (("playerByClub"."clubId" = "Club"."clubId")))
     LEFT JOIN public."League" ON (("Club"."leagueId" = "League"."leagueId")))
     LEFT JOIN public."Statistics" ON ((("Club"."clubId" = "Statistics"."clubId") AND ("Club"."leagueId" = "Statistics"."leagueId"))))
  ORDER BY COALESCE((("Statistics"."winCount" * 3) + "Statistics"."drawCount"), 0) DESC, COALESCE(("Statistics".scored - "Statistics".conceded), 0) DESC, COALESCE("Statistics"."winCount", 0) DESC, "Club".name;


ALTER VIEW public."MyLeagueClubView" OWNER TO "Emrecan";

--
-- TOC entry 242 (class 1259 OID 16972)
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
-- TOC entry 239 (class 1259 OID 16937)
-- Name: MyPlayerView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."MyPlayerView" AS
 SELECT "Player"."playerId",
    "Participant"."participantId",
    "Club".name AS "clubName",
    "Player"."fullName",
    (EXTRACT(year FROM age(("Player".birthday)::timestamp with time zone)))::integer AS age,
    ( SELECT COALESCE(sum("Performance"."goalCount"), (0)::bigint) AS sum
           FROM public."Performance"
          WHERE ("Performance"."playerId" = "Player"."playerId")) AS goals,
    ( SELECT COALESCE(sum("Performance"."assistCount"), (0)::bigint) AS sum
           FROM public."Performance"
          WHERE ("Performance"."playerId" = "Player"."playerId")) AS assists,
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
-- TOC entry 3818 (class 0 OID 0)
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
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 217
-- Name: Participant_participantId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Participant_participantId_seq" OWNED BY public."Participant"."participantId";


--
-- TOC entry 238 (class 1259 OID 16930)
-- Name: PlayerView; Type: VIEW; Schema: public; Owner: Emrecan
--

CREATE VIEW public."PlayerView" AS
 SELECT "Player"."playerId",
    "Club".name AS "clubName",
    "Player"."fullName",
    (EXTRACT(year FROM age(("Player".birthday)::timestamp with time zone)))::integer AS age,
    ( SELECT COALESCE(sum("Performance"."goalCount"), (0)::bigint) AS sum
           FROM public."Performance"
          WHERE ("Performance"."playerId" = "Player"."playerId")) AS goals,
    ( SELECT COALESCE(sum("Performance"."assistCount"), (0)::bigint) AS sum
           FROM public."Performance"
          WHERE ("Performance"."playerId" = "Player"."playerId")) AS assists,
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
-- TOC entry 3820 (class 0 OID 0)
-- Dependencies: 226
-- Name: Player_playerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Player_playerId_seq" OWNED BY public."Player"."playerId";


--
-- TOC entry 235 (class 1259 OID 16842)
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
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 219
-- Name: Referee_refereeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Referee_refereeId_seq" OWNED BY public."Referee"."refereeId";


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
-- TOC entry 3822 (class 0 OID 0)
-- Dependencies: 221
-- Name: Venue_venueId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Emrecan
--

ALTER SEQUENCE public."Venue_venueId_seq" OWNED BY public."Venue"."venueId";


--
-- TOC entry 3582 (class 2604 OID 16677)
-- Name: Club clubId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club" ALTER COLUMN "clubId" SET DEFAULT nextval('public."Club_clubId_seq"'::regclass);


--
-- TOC entry 3589 (class 2604 OID 16717)
-- Name: Fixture fixtureId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture" ALTER COLUMN "fixtureId" SET DEFAULT nextval('public."Fixture_fixtureId_seq"'::regclass);


--
-- TOC entry 3577 (class 2604 OID 16576)
-- Name: League leagueId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League" ALTER COLUMN "leagueId" SET DEFAULT nextval('public."League_leagueId_seq"'::regclass);


--
-- TOC entry 3573 (class 2604 OID 16455)
-- Name: Organizer organizerId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer" ALTER COLUMN "organizerId" SET DEFAULT nextval('public."Organizer_organizerId_seq"'::regclass);


--
-- TOC entry 3574 (class 2604 OID 16446)
-- Name: Participant participantId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant" ALTER COLUMN "participantId" SET DEFAULT nextval('public."Participant_participantId_seq"'::regclass);


--
-- TOC entry 3579 (class 2604 OID 16623)
-- Name: Player playerId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Player" ALTER COLUMN "playerId" SET DEFAULT nextval('public."Player_playerId_seq"'::regclass);


--
-- TOC entry 3575 (class 2604 OID 16525)
-- Name: Referee refereeId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee" ALTER COLUMN "refereeId" SET DEFAULT nextval('public."Referee_refereeId_seq"'::regclass);


--
-- TOC entry 3576 (class 2604 OID 16536)
-- Name: Venue venueId; Type: DEFAULT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Venue" ALTER COLUMN "venueId" SET DEFAULT nextval('public."Venue_venueId_seq"'::regclass);


--
-- TOC entry 3804 (class 0 OID 16674)
-- Dependencies: 230
-- Data for Name: Club; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Club" ("clubId", name, description, "logoPath", "leagueId", "cupCount") FROM stdin;
25	Karşıyaka FK	⚽ Karşıyaka FC | Heart & Hustle | Est. 1912 | 📍 Karşıyaka, Izmir | 🔴🟢 Where Legacy Lives On | Be part of the journey: #KarşıyakaUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f2%2f393%2fkarsiyaka-1.png	20	0
21	Esenler Erokspor	⚽ Esenler Erokspor FC | Unity in Football | Established 1984 | 📍 Esenler, Istanbul | 💚💛 Fierce on the Field | Tag along: #EroksporRising 🔝	https://i.goalzz.com/?i=medalss%2f45269.jpg	12	0
44	Çayırova Spor	⚽ Çayırova Spor FC | Green Power, Black Strength | Established 1980 | 📍 Çayırova, Kocaeli | 🟢⚫ Where Passion Plays | Share our journey: #ÇayırovaRising 🔝	https://i.goalzz.com/?i=o%2ft%2f37%2f219%2fcayirova-spor-1.png	10	0
39	Beşiktaş Çarşı	⚽ Beşiktaş Çarşı | The Heartbeat of Beşiktaş | Est. 1982 | 📍 İstanbul | ⚫⚪ Where Fan Passion Meets Football | Join the chorus: #ÇarşıUnited 🔝	https://i.goalzz.com/?i=katkotati%2fequipe%2ftur%2fbesiktas.gif	12	0
27	Kurtalan Spor	⚽ Kurtalan Spor FC | Power & Persistence | Est. 1957 | 📍 Kurtalan, Siirt | 🟦⚪ Where passion takes the lead | We are #KurtalanSporUnite 🔝	https://i.goalzz.com/?i=o%2ft%2f24%2f559%2fkurtalan-spor-1.png	19	0
24	Hacettepe Spor	⚽ Hacettepe Spor | Est. 1954 | 📍 Ankara | 🟪⚪ Passion & Precision | Empowering Youth | Share our journey: #HacettepeRising 🔝	https://i.goalzz.com/?i=4_safi_only%2fturk%2fhacettepelogo.gif	12	0
37	Fenerbahçe GFB	⚽ Fenerbahçe GFB | 💙💛 Passion Burns Here | Founded 1907 | 📍 Istanbul | Rising to Every Challenge | Follow the Flame: #FenerbahçeGFB 	https://i.goalzz.com/?i=katkotati%2fequipe%2ftur%2ffenerbahce.gif	12	0
34	Tirespor 1922	⚽ Tirespor 1922 FC | Rooted in Tradition, Reaching for Triumph | Est. 1922 | 📍 Tire, Izmir | 🔴⚪ Upholding Legacy | Be part of the story: #Tire1922Rise 🔝	https://i.goalzz.com/?i=o%2ft%2f24%2f602%2ftirespor-1922-1.png	19	0
41	Bergama BS	⚽ Bergama Belediyespor FC | Red Heart, Blue Spirit | Founded 1959 | 📍 Bergama, Izmir | 🔴🔵 Building a Better Game | Stand with us: #BergamaUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f22%2f160%2fbergama-belediyespor-1.png	19	0
28	Merzifonspor FK	⚽ Merzifonspor FC | Born to Play, Built to Win | Est. 1954 | 📍 Merzifon, Amasya | 🔵⚪ Marching Forward with Harmony | Experience our journey #MerzifonsporPride 🔝	https://i.goalzz.com/?i=o%2ft%2f22%2f180%2fmerzifonspor-1.png	19	0
20	Eğirdirspor FK	⚽ Eğirdirspor FC | Where Passion Plays | Est. 1984 | 📍 Eğirdir, Isparta | Embodying Resilience | 🔵🔴 | Track our journey #EğirdirsporRising 🔝	https://i.goalzz.com/?i=o%2ft%2f24%2f556%2fegirdir-spor-1.png	19	0
43	Bigospro SK	⚽ Bigaspor SK | Forging Champions | Established 1930 | 📍 Biga, Çanakkale | 🔵⚪ Blues Conquering the Field | Follow our stride: #BigasporRising 🔝	https://i.goalzz.com/?i=o%2ft%2f37%2f217%2fbigaspor-1.png	10	0
35	ALG Spor	⚽ ALG Spor FC | Established 1980 | 📍 Gaziantep | 💛⚪ Inspiring Change, Building Future | Ignite the passion with #ALGSporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f38%2f617%2falg-spor-1.png	10	0
42	Bağcılar SK	⚽ Bağcılar SK | United in Blue & White | Founded in 1989 | 📍 Bağcılar, Istanbul | 🔵⚪ Dedicated to the Beautiful Game | Join us at #BağcılarRise 🔝	https://i.goalzz.com/?i=o%2ft%2f34%2f518%2fbagcilar-spor-kulubu-1.png	10	0
26	Kocaelispor FK	⚽ Kocaelispor FC | Shake the Green Earth, Sky in Black | Established 1966 | 📍 Kocaeli | 🟩⬛ Dynamic Play, Steady Progress | Join #KocaelisporJourney 🔝	https://i.goalzz.com/?i=o%2ft%2f3%2f298%2fkocaelispor-1.png	10	0
31	Turgutluspor	⚽ Turgutluspor FC | Passion in Each Play | Founded 1922 | 📍 Turgutlu, Manisa | 🔴⚪ Where Spirit Meets Sport | Follow our progress at #TurgutluRising 🔝	https://i.goalzz.com/?i=o%2ft%2f7%2f535%2fturgutluspor-1.png	15	0
30	Pazarspor FK	⚽ Pazarspor FC | Fuelled by Passion, Driven by Ambition | Est. 1968 | 📍 Pazar, Rize | 🔵⚪ Wave of the Northern Black Sea | Join the wave: #PazarsporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f7%2f536%2fpazarspor-1.png	15	0
22	Foça Belediyespor	⚽ Foça Belediyespor FC | Football & Community | Est. 1959 | 📍 Foça, Izmir | 🟢🔵 United Under One Goal | Join the journey: #FoçaVictoryRise 🔝	https://i.goalzz.com/?i=zizzzo%2f50732.jpg	15	0
23	Gebzespor FK	⚽ Gebzespor FC | Founded 1955 | 📍 Gebze, Kocaeli | 🟣⚪ Celebrating Our Colors | Strength in Unity | Follow Our Stride: #GebzesporStrong 🔝	https://i.goalzz.com/?i=o%2ft%2f9%2f518%2fgebzespor-1.png	15	0
54	Soma Spor FK	⚽ Somaspor FC | Established 1979 | 📍 Soma, Manisa | ⚫⚪ Where Tradition Meets Tenacity | Be part of the journey: #SomasporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f40%2f146%2fsoma-spor-dernegi-1.png	10	0
33	Torbalıspor FK	⚽ Torbalıspor FC | Heritage and Heart | Est. 1954 | 📍 Torbalı, Izmir | 🔴⚪ Fueling Passion | Chart our journey: #TorbalısporRising 🔝	https://i.goalzz.com/?i=o%2ft%2f16%2f649%2ftorbalispor-1.png	20	0
32	Trabzon Kanuni FK	⚽ Trabzon Kanuni FC | Tradition Meets Triumph | Est. 1982 | 📍 Trabzon | 🔴🔵 Embracing the Game | Join the journey #TrabzonKanuniUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f20%2f671%2fkanunispor-1.png	20	0
29	Patnos Gençlikspor	⚽ Patnos Gençlik Spor FC | Est. 1984 | Raising Stars in Patnos | 📍 Patnos, Ağrı | Uniting 🟦⭐ for the beautiful game | Follow our story: #PatnosGençlikRising 🔝	https://i.goalzz.com/?i=o%2ft%2f20%2f679%2fpatnos-genclik-spor-1.png	20	0
53	Sidespor FK	⚽ Side Spor FC | United in Strength | Est. 1968 | 📍 Manavgat, Antalya | ⚪🟡 Celebrating Heritage, Creating Future | Follow our path: #SideSporRising 🔝	https://i.goalzz.com/?i=o%2ft%2f2%2f980%2fsidespor-1.png	20	0
46	Gölcükspor FK	⚽ Gölcükspor FC | Strength In Stripes | Est. 1964 | 📍 Gölcük, Kocaeli | ⚫🔴 Triumph through Teamwork | Join the journey: #GölcüksporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f20%2f666%2fgolcukspor-1.png	20	0
51	Keçiören Sportif	⚽ Keçiören Sportif | United in Blue | Est. 1988 | 📍 Keçiören, Ankara | 🔵 Nurturing Talent, Igniting Passion | Stand with us: #KeçiörenSportifRising 🔝	https://i.goalzz.com/?i=o%2ft%2f16%2f651%2fkecioren-sportif-1.png	20	0
62	Erzin Spor	⚽ Erzin Spor FC | United in Orange & White | Established 1966 | 📍 Erzin, Hatay | 🟠⚪ Igniting Football Passion | Be part of the story: #ErzinSporRising 🔝	https://i.goalzz.com/?i=o%2ft%2f24%2f600%2ferzin-spor-1.png	19	0
65	Edirne Gençlik SK	⚽ Edirne Gençlik FK | Fusing Blue Determination, Red Passion, Black Strength | Est. 1987 | 📍 Edirne | 🔵🔴⚫ Crafting Tomorrow's Champions | Join the rally: #EdirneGençlikFK 🔝	https://i.goalzz.com/?i=o%2ft%2f22%2f165%2fedirnespor-genclik-1.png	19	0
50	Haçka Spor	⚽ Hacka Spor FC | Red Devotion, White Purity, Blue Ambition | Est. 1980 | 🔴⚪🔵 Building Champions | Join the rise: #HackaSporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f22%2f188%2fhacka-spor-1.png	19	0
57	Ağrı Gençler FK	⚽ Ağrı Gençler FK | Passionate Play ⚫🔴 | Est. 1970 | 📍 Ağrı | Fostering Future Stars | Make waves with us: #AğrıGençlerFK 🔝	https://i.goalzz.com/?i=o%2ft%2f28%2f547%2fagri-genclerbirligi-1.png	19	0
55	Jetpa Spor	⚽ Jetpa Spor FC | Fueled by Passion, Flying High | Founded 1993 | ⚪🟡 Where Will Meets Skill | On the rise: #JetpaSporFlight 🔝	https://i.goalzz.com/?i=o%2ft%2f3%2f567%2fsiirt-jetpa-spor-1.png	10	0
59	Dardanelspor	⚽ Ankara Dardanelspor FC | White Purity, Red Passion, Blue Depth | Established 1967 | 📍 Ankara | Uniting Colors for the love of the game | Join us: #DardanelsporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f3%2f871%2fdardanelspor-1.png	10	0
52	Ödemişspor FK	⚽ Ödemişspor FC | Blue Power, White Pride | Founded in 1966 | 📍 Ödemiş, Izmir | 🔵⚪ Stride in Unity | Keep the flame alive: #ÖdemişsporUnite 🔝	https://i.goalzz.com/?i=o%2ft%2f37%2f218%2fodemisspor-1.png	10	0
45	Erbaaspor SK	⚽ Erbaaspor FC | United in Blue & White | Est. 1968 | 📍 Erbaa, Tokat | 🔵⚪ Rising Determination, Steadfast Spirit | Be part of #ErbaasporJourney 🔝	https://i.goalzz.com/?i=o%2ft%2f31%2f640%2ferbaaspor-1.png	10	0
49	İçel İdman Yurdu	⚽ İçel İdman Yurdu FC | Power, Passion, Pride | Est. 1985 | 📍 Mersin | 🔴🟡 Carrying the Torch | Forward together: #İçelİdmanYurduUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f41%2f38%2ficel-idmanyurdu-1.png	15	0
48	Hoçvan Spor	⚽ Hoçvan Spor FC | Excellence Through Effort | Est. 1980 | 📍 Van | 🔴⚪ Where Passion Plays | Blaze the trail with #HoçvanUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f41%2f32%2fhocvan-spor-1.png	15	0
47	Hendek Spor	⚽ Hendekspor FC | Embracing the Green Spirit | Established 1958 | 📍 Hendek, Sakarya | ⚪🟢 Building Tomorrow's Champions | Stand with us: #HendekUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f41%2f35%2fhendek-spor-1.png	15	0
61	Boyabat 1868 SK	⚽ Boyabat 1868 SK | Unity in Blue, Yellow, White | Est. 1970 | 📍 Boyabat, Sinop | 🔵🟡⚪ Where tradition & transformation meet | Join our journey: #Boyabat1868United 🔝	https://i.goalzz.com/?i=o%2ft%2f41%2f30%2fboyabat-1868-spor-1.png	15	0
60	Çubuk SK	⚽ Çubuk SK | Forging Future in Blue & Yellow | Founded 1947 | 📍 Çubuk, Ankara | 🔵🟡 Growth, Grit, Glory | Keep pace with us: #ÇubukSKRising 🔝	https://i.goalzz.com/?i=o%2ft%2f41%2f26%2fcubuk-spor-kulubu-1.png	15	0
66	Adliyespor FK	⚽ Ankara Adliyespor FK | 🔴⚪ Where Justice Meets Joy of the Game | Est. 1952 | 📍 Ankara | Upholding Values, Breaking Boundaries | On the move: #AdliyesporRising	https://i.goalzz.com/?i=ash04%2fadliyespor+.jpg	12	0
17	Bucaspor FK	⚽ Bucaspor FC | Est. 1928 | 📍 Buca, Izmir | 🏆 Grit & Glory | 🔵🟡 Empowering talent | Follow our journey #BucasporRising 🔝	https://i.goalzz.com/?i=-vitchmen-%2fbuca.jpg	12	0
18	Darıca Gençler FK	⚽ Darıca Gençler FC | Young Hearts, Bold Spirits | Est. 1967 | 📍 Darıca, Kocaeli | Champions in Progress | 🟢🟡 | Join our journey 	https://i.goalzz.com/?i=o%2ft%2f2%2f982%2fdarica-genclerbirlig-1.png	20	0
64	Fethiyespor	⚽ Fethiyespor FC | Red Passion, White Purity, Purple Pride | Founded 1933 | 📍 Fethiye, Muğla | 🔴⚪🟣 Ignite, Unite, Fight! | Rise with us: #FethiyesporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f18%2f753%2ffethiyespor-1.png	20	0
56	1074 Çankırıspor	⚽ 1074 Çankırıspor FC | ⚫🔴 Steadfast Spirit, Determined Play | Est. 1956 | 📍 Çankırı | Where Heart Beats for the Game | Join us: #ÇankırısporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f2%2f979%2f1074-cankiri-spor-1.png	20	0
19	Düzcespor FK	⚽ Düzce Spor FC | Passion Meets Powerful Play | Est. 1967 | 📍 Düzce City | Determination and Dedication | 🔵🔴 | #DüzceSporRising🔝	https://i.goalzz.com/?i=o%2ft%2f28%2f640%2fduzce-spor-1.png	19	0
63	Dudulluspor	⚽ Dudulluspor FC | Green Strength, White Spirit | Est. 1954 | 📍 Ümraniye, Istanbul | 🟢⚪ Fueling the Future of Football | Join the charge: #DudullusporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f49%2f274%2fdudulluspor-1.png	15	0
40	Aydınspor FK	⚽ Aydınspor FC | Unity in Black & White | Established 1923 | 📍 Aydın | ⚫⚪ Legacy, Passion, Power | All for the Game: #AydınsporRising 🔝	https://i.goalzz.com/?i=ash03%2faydinspor.jpg	12	1
16	Beykozspor FK	⚽ Beykozspor FC | Since 1908 |📍 Istanbul | 🏆 Passion & Talent | #Beykozspor 🔴🟡	https://i.goalzz.com/?i=o%2ft%2f12%2f406%2fbeykozspor-1.png	12	0
36	Araklıspor	⚽ Araklıspor FC | Strength in Stripes, Power in Play | Est. 1954 | 📍 Araklı, Trabzon | ⚫🟢 Where Passion Thrives | Gear up for glory: #AraklısporUnited 🔝	https://i.goalzz.com/?i=o%2ft%2f11%2f116%2faraklispor-1.png	12	0
38	Galatasaray UA	⚽ Galatasaray UltraAslan | 🔴🟡 Roaring Spirit of Istanbul | Est. 1980 | 📍 Istanbul | Fan Power Unleashed | Stand with us: #UltraAslanUnited 🔝	https://i.goalzz.com/?i=katkotati%2fequipe%2ftur%2fgalatasaray.jpg	12	0
\.


--
-- TOC entry 3807 (class 0 OID 16714)
-- Dependencies: 233
-- Data for Name: Fixture; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Fixture" ("fixtureId", "leagueId", "homeClubId", "awayClubId", "homeTeamScore", "awayTeamScore", week, "refereeId", "venueId") FROM stdin;
93	12	37	21	\N	\N	1	12	8
95	12	24	16	\N	\N	1	35	31
96	12	17	40	\N	\N	2	37	37
97	12	36	21	\N	\N	2	12	8
98	12	66	38	\N	\N	2	16	47
99	12	37	16	\N	\N	2	35	31
100	12	39	24	\N	\N	2	34	22
101	12	17	21	\N	\N	3	12	8
102	12	40	38	\N	\N	3	16	47
103	12	36	16	\N	\N	3	35	31
104	12	66	24	\N	\N	3	34	22
105	12	37	39	\N	\N	3	9	23
106	12	17	38	\N	\N	4	16	47
107	12	21	16	\N	\N	4	35	31
108	12	40	24	\N	\N	4	34	22
109	12	36	39	\N	\N	4	9	23
110	12	66	37	\N	\N	4	53	24
111	12	17	16	\N	\N	5	35	31
112	12	38	24	\N	\N	5	34	22
113	12	21	39	\N	\N	5	9	23
114	12	40	37	\N	\N	5	53	24
115	12	36	66	\N	\N	5	6	50
116	12	17	24	\N	\N	6	34	22
117	12	16	39	\N	\N	6	9	23
118	12	38	37	\N	\N	6	53	24
119	12	21	66	\N	\N	6	6	50
120	12	40	36	\N	\N	6	39	21
121	12	17	39	\N	\N	7	9	23
122	12	24	37	\N	\N	7	53	24
123	12	16	66	\N	\N	7	6	50
124	12	38	36	\N	\N	7	39	21
125	12	21	40	\N	\N	7	56	11
126	12	17	37	\N	\N	8	53	24
127	12	39	66	\N	\N	8	6	50
128	12	24	36	\N	\N	8	39	21
129	12	16	40	\N	\N	8	56	11
130	12	38	21	\N	\N	8	37	37
131	12	17	66	\N	\N	9	6	50
132	12	37	36	\N	\N	9	39	21
133	12	39	40	\N	\N	9	56	11
134	12	24	21	\N	\N	9	37	37
135	12	16	38	\N	\N	9	12	8
136	12	36	17	\N	\N	10	39	21
137	12	40	66	\N	\N	10	56	11
138	12	21	37	\N	\N	10	37	37
139	12	38	39	\N	\N	10	12	8
140	12	16	24	\N	\N	10	16	47
141	12	40	17	\N	\N	11	56	11
142	12	21	36	\N	\N	11	37	37
143	12	38	66	\N	\N	11	12	8
144	12	16	37	\N	\N	11	16	47
145	12	24	39	\N	\N	11	35	31
146	12	21	17	\N	\N	12	37	37
147	12	38	40	\N	\N	12	12	8
148	12	16	36	\N	\N	12	16	47
149	12	24	66	\N	\N	12	35	31
150	12	39	37	\N	\N	12	34	22
151	12	38	17	\N	\N	13	12	8
152	12	16	21	\N	\N	13	16	47
153	12	24	40	\N	\N	13	35	31
154	12	39	36	\N	\N	13	34	22
155	12	37	66	\N	\N	13	9	23
156	12	16	17	\N	\N	14	16	47
157	12	24	38	\N	\N	14	35	31
158	12	39	21	\N	\N	14	34	22
159	12	37	40	\N	\N	14	9	23
160	12	66	36	\N	\N	14	53	24
161	12	24	17	\N	\N	15	35	31
162	12	39	16	\N	\N	15	34	22
163	12	37	38	\N	\N	15	9	23
164	12	66	21	\N	\N	15	53	24
165	12	36	40	\N	\N	15	6	50
166	12	39	17	\N	\N	16	34	22
167	12	37	24	\N	\N	16	9	23
168	12	66	16	\N	\N	16	53	24
169	12	36	38	\N	\N	16	6	50
170	12	40	21	\N	\N	16	39	21
171	12	37	17	\N	\N	17	9	23
172	12	66	39	\N	\N	17	53	24
173	12	36	24	\N	\N	17	6	50
174	12	40	16	\N	\N	17	39	21
175	12	21	38	\N	\N	17	56	11
176	12	66	17	\N	\N	18	53	24
177	12	36	37	\N	\N	18	6	50
178	12	40	39	\N	\N	18	39	21
179	12	21	24	\N	\N	18	56	11
180	12	38	16	\N	\N	18	37	37
91	12	17	36	\N	\N	1	56	11
92	12	66	40	\N	\N	1	37	37
94	12	39	38	10	10	1	16	47
\.


--
-- TOC entry 3800 (class 0 OID 16573)
-- Dependencies: 225
-- Data for Name: League; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."League" ("leagueId", "organizerId", name, prize, description, "logoPath", state) FROM stdin;
22	43	Yozgat Amatör Ligi	500000	⚽️ Official Yozgat Amatör Lig 🏆 | Fostering local football spirit since 2023 | Yozgat, Turkey 📍 🇹🇷 | #YozgatAmatorLigi 🏟️⚽	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLGf-WbGNugQMM0ecDIPwFaWZDoNHhlTyesNC7u3XGAj0IC8ao0ubWtfP1h42ZlCtrxow&usqp=CAU	Not started
24	45	Fortis Türkiye Kupası	12000000	🏆 Official Fortis Türkiye Kupası | Showcasing the best of amateur football since 2023 | Turkey 📍🇹🇷 | #FortisTurkiyeKupasi ⚽️🏅	https://seeklogo.com/images/F/fortis-turkiye-kupasi-logo-DBA9CD55F6-seeklogo.com.png	Not started
25	46	Turkcell Süper Kupa	8000000	🏆 Official Turkcell Super Kupa | Fueling amateur football excellence since 2023 | Turkey 📍🇹🇷 | #TurkcellSuperKupa ⚽️🔝	https://upload.wikimedia.org/wikipedia/tr/4/47/Türkiye_Süper_Kupası_2016.png	Not started
10	31	İzmir U12 Cup	125000	🏆 Izmir U12 Cup Official 🚀 | Empowering young football talent 🌟 | Izmir, Turkey 📍 | #IzmirU12Cup ⚽️	https://play-lh.googleusercontent.com/N6N3m3iCj3Z4Wkbq-EDyzq2ad0dICdG4hFqTJJCw-nGpxNT53hRMJiHfKZ9RUa77Q1I=w600-h300-pc0xffffff-pd	Not started
11	32	Turkcell Kadınlar Ligi	5200000	Turkcell Women's Football Super League 🏆 | Breaking the mold in women's amateur football since 2023 👭 | Turkey 🇹🇷 | #TurkcellKadinFutbolSuperLigi 💫	https://upload.wikimedia.org/wikipedia/tr/c/c4/Turkcell_Kadın_Futbol_Süper_Ligi.png	Not started
13	34	Misli.com 2. Lig	6400000	⚽️ Misli.com 2. Lig Official 🏆 | Elevating amateur football since 2023 | From Turkey with passion 📍🇹🇷 | #MisliCom2Lig 🚀	https://upload.wikimedia.org/wikipedia/tr/2/25/Spor_Toto_2._Lig_logo.png	Not started
14	35	Master Futbol Ligi	50000	⚽ Mastering the game at Istanbul Masters Football League 🏆 | Showcasing seasoned talent since 2023 | Istanbul, Turkey 📍🇹🇷 | #IstanbulMasterFutbolLigi 💪	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXxTK969jzgMW_hXFoCzK8VZNGIuefHp46lg&usqp=CAU	Not started
15	36	Şirketler Futbol Ligi	750000	⚽️ Şirketler Futbol Ligi Official 🏆 | Corporate teams clashing on the pitch since 2023 | Turkey 📍🇹🇷 | #SirketlerFutbolLigi 💼⚽	https://www.sirketlerligi.com/pic_lib/bigSize/icerikler/6836/ahmet-naci-dizman_6836_300504.jpg	Not started
16	37	Misli.com 3. Lig	4500000	⚽️ Misli.com 3. Lig Official 🏆 | Amplifying every kick in amateur football since 2023 | Turkey 📍🇹🇷 | #MisliCom3Lig 🎉⚽	https://upload.wikimedia.org/wikipedia/tr/4/47/TFF3_kopya.png	Not started
17	38	Korumalı Futbol Ligi	75000	⚽️ Türkiye Korumalı Futbol Ligi Official 🏆 | Upholding football tradition since 2023 | Turkey 📍🇹🇷 | #TurkiyeKorumaliFutbolLigi ✊🔥	https://upload.wikimedia.org/wikipedia/tr/5/52/Tkfl1.lig_resmi_logo.png	Not started
18	39	ÜniLig 2024	25000	⚽️ Official ÜniLig 🏆 | Sparking university football rivalries since 2013 | Turkey 📍🇹🇷 | #UniLig 📚⚽️	https://pbs.twimg.com/profile_images/725695352599404546/TwOzd0hS_400x400.jpg	Not started
19	40	Bilyoner Rakipbul Ligi	2000000	⚽️ Official Bilyoner Rakipbul Ligi 🏆 | Spotting football competitors since 2023 | Turkey 📍🇹🇷 | #BilyonerRakipbulLigi ⚔️⚽	https://pbs.twimg.com/profile_images/1326270414474063876/CbeNwZx4_400x400.jpg	Not started
20	41	İddaa Rakipbul Ligi	3200000	⚽️ Official İddaa Rakipbul Ligi 🏆 | Challenging the norm in amateur football since 2023 | Turkey 📍🇹🇷 | #IddaaRakipbulLigi 🎯⚽️	https://i1.sndcdn.com/avatars-000316151146-jcf1jp-t500x500.jpg	Not started
21	42	TFF BAL Ligi	800000	⚽️ Official TFF Bölgesel Amatör Lig 🏆 | Celebrating regional amateur football talent since 2023 | Turkey 📍 🇹🇷 | #TFFBolgeselAmatorLigi 🌍⚽	https://www.tff.org/Resources/TFF/Auto/4ba182485742400bbb1a3d1738d107e2.jpg	Not started
26	47	Ziraat Türkiye Kupası	10000000	🏆 Official Ziraat Türkiye Kupası | Cultivating amateur football dreams since 2023 | Turkey 📍🇹🇷 | #ZiraatTurkiyeKupasi ⚽️🎖️	https://upload.wikimedia.org/wikipedia/tr/6/61/Ziraat_Türkiye_Kupası_logosu.png	Not started
27	48	TFF Kadın Futbolu	1250000	⚽️ Official TFF Kadın Futbolu 🏆 | Shaping the future of women's amateur football since 2023 | Turkey 📍🇹🇷 | #TFFKadinFutbolu 👩⚽️💫	https://iconape.com/wp-content/png_logo_vector/tff-kadinlar-futbol-ligi-logo.png	Not started
28	54	Bitci Türkiye Kupası	7500000	🏆 Official Bitci Türkiye Kupası | Pushing the boundary in amateur football since 2023 | Turkey 📍🇹🇷 | #BitciTurkiyeKupasi ⚽️🥇	https://upload.wikimedia.org/wikipedia/tr/c/ca/2022_Türkiye_basketbol_kupası_logo.jpg	Not started
29	55	11. Fetih Kupası	100000	🏆 Official 11. Fetih Kupası | Honoring football conquests since 2023 | Turkey 📍🇹🇷 | #11FetihKupasi ⚽️🎖️	https://extranet.worldarchery.sport/CompetitionLogos/25739.png	Not started
23	44	Trendyol SüperLig	32000000	⚽️ Official Trendyol SüperLig 🏆 | Igniting the amateur football scene since 2023 | Turkey 📍🇹🇷 | #TrendyolSuperLig 🔥⚽️	https://www.tff.org/Resources/TFF/Images/0000000015/TFF/TFF-Logolar/2023-trendyol/trendyol-super-lig-dikey.png	Not started
12	33	Trendyol 1. Lig	9600000	⚽️ Official of Trendyol 1. Lig 🏆 | Unleashing amateur football passion since 2023 🥇 | Turkey 📍 🇹🇷 | #Trendyol1Lig 🔥	https://upload.wikimedia.org/wikipedia/commons/5/5c/Trendyol_1.Lig_Logo.png	In progress
\.


--
-- TOC entry 3790 (class 0 OID 16392)
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
-- TOC entry 3793 (class 0 OID 16436)
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
65	alidasdemir	$2b$10$snNlNzuFzQCqyIREFfMQuu/D/iUUq6PvzGAbAVHELylDJ0k1rx8Zm	ali.eren.dasdemir@flos.com	70	28
27	abdullahyigitler	$2b$10$FEJKSER2YJgSrF3Ck4IIgOPERdI8MuWA5pyiVUDUswz00mD7gZQDS	abdullah.yigitler@flos.com	32	\N
28	abdulsameddamlu	$2b$10$jv6nkaVxrTjjZlwksl5Kru3g1bd39BoKFVgl3m3wDEfXj8ddjeftG	abdulsamed.damlu@flos.com	33	\N
46	ahmetilhanozek	$2b$10$4aq/MMKIw7L6jB7xqkM.iuPTEOj/IjQLu10ZBhq7zXVKk5UmfSWie	ahmet.ilhan.ozek@flos.com	51	61
30	abdurrahmancanli	$2b$10$BPF3CnArnzWvYrxvIrvhH.a.pTZa8VN.izPFI7PxCcAy7L1xBKmqe	abdurrahman.canli@flos.com	35	\N
31	abdussmdkarnucu	$2b$10$vzYHEuD0AVb8iGIFX.rububJBUdaNSTMQqZjulypSaQ7utw9cwB5q	abdussamed.karnucu@flos.com	36	\N
32	ademagaoglu	$2b$10$Vzq2jj7SdTwgiYCnBI666.rO7MP7ojR7yzqcD6OYEPAZs2tdckbdG	adem.agaoglu@flos.com	37	\N
10	emrcnkaracayir	$2b$10$IvHkDCrGahTNnQ5pS6XDSelwBGVSaHGat.ZKnPs19jPxp6r1upr9y	emrecan.karacayir@flos.com	\N	\N
11	veyselsaydam	$2b$10$q7FKzQzdO5dX/KjImiFkFeTQHF4IMk3XlBlZeKW/8Frqv9DNItdBm	veysel.saydam@flos.com	\N	\N
12	ilhanparlak	$2b$10$xwbyml6NOZy.s5vI9ejn7.YKLoSiBxQzzYKG7mMHs.6/ea6i0o2R6	ilhan.parlak@flos.com	16	\N
13	seyhmusaksu	$2b$10$4hXP/NYDJ2ccsbwPnPoJ/Oqe2r4JLe/4cKwF940dLpaLRHGmJpoay	seyhmus.aksu@flos.com	17	\N
47	ahmetkarademir	$2b$10$.NWEW0.eGm1pgZS27oPoEuVnPdU6AdPGtM1IqIesAL418evdk1iBG	ahmet.karademir@flos.com	52	65
15	abdlzdemircan	$2b$10$pR19F2iN2/sBRqyzF0CLBeM98HIBlVdW1.XakBdIlcd77N86EA1Eq	a.demircan@flos.com	20	\N
16	cebrailakbulut	$2b$10$gJoGKh7UbkyqjX3/5P5gmeA0Ze17xmk/LoiDg3.AUMFO3GTaie04m	a.cebrail.akbulut@flos.com	21	\N
29	abdurrahimdursun	$2b$10$B9vNcSiibRehkrVHR4X3TupbtCEgfH6vxm6/CUzzaTc9W/eXnznIi	abdurrahim.dursun@flos.com	34	55
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
14	umitaydin	$2b$10$2recAZSt4edWxiu8HBDSP.vTJhdqHnfKDiy48WMkDJlHmeRcH8uPe	umit.aydin@flos.com	19	62
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
17	abdulkadirdemir	$2b$10$dcB/UEXgqGN.rQ7fHqr9U.umRQSLTzd6ICsCFAlLGbkfXkiIpbyxu	abdulkadir.demir@flos.com	22	51
64	alidere	$2b$10$ru4fL6CVZQZpyHUo3vdI3ujrQ.jhk0dW4kaTW3qBp4PXDjjVt/XDO	ali.dere@flos.com	69	\N
63	alidemirel	$2b$10$eLXK/WkDIe16SPj5hN4kjuSUKlJVPqHgWWjsxhzoJFzOYqaFFovmy	ali.demirel@flos.com	68	49
26	abdllhsahindere	$2b$10$ZqldCukR2e5IvV53SwUZtOuiHRIrks0/iX5sINGsA257WgNk.5GSG	abdullah.sahindere@flos.com	31	17
66	aliiyican	$2b$10$mQblg9cj1oR7K.Htj7fV/O.wp1ss/gqt/vly2bt9a5LNCgWttthvy	ali.eren.iyican@flos.com	71	\N
67	alierenkaradag	$2b$10$TnbSClWGhmPXdV2ewwK8nu.pFerpl95aK9pZdEb7dAWlG4w0orDG2	ali.eren.karadag@flos.com	72	\N
68	alierenyalcin	$2b$10$S0FXYW5IRXLrIiXGiTu8vuFxmfWISy511ZNRgSS64pMEfvUnr1/fi	ali.eren.yalcin@flos.com	73	\N
69	aligocmen	$2b$10$5UJ.MLTW0Lk/82xr2Bq6ne4ply7Rh5QLwBbHR7YjIOsDICfuE3OXG	ali.gocmen@flos.com	74	\N
106	batuhanyayikci	$2b$10$QkGxu3mx7.gujG0l1xiQD.Cscr9C.O.Esqpsr40IM67wBv4xSbIuq	batuhan.yayikci@flos.com	111	31
71	alikarakaya	$2b$10$nW5r/DDd9cGoUsXuaCPYqu.wmGEOb3/WaVvtfplQyZNOQP8dzis0O	ali.karakaya@flos.com	76	\N
72	alisahinyilmaz	$2b$10$P.BIsKjWt4RHY0.p6FyoS.UdecQ0fbawt1b7acY1yVw93xoMMdi1O	ali.sahin.yilmaz@flos.com	77	\N
81	alihankubalas	$2b$10$C4bW8tyzIKEQmLgE6b8Xy.CjQpAZh1CCmn4BNeF.usKG05ggVJr3a	alihan.kubalas@flos.com	86	53
74	aliturapbulbul	$2b$10$CB4i/hS.TeSOBiD0AhYrMOiWlheEdUSTqbWHz8fjAKFOGV0bsnCiS	ali.turap.bulbul@flos.com	79	\N
75	aliulusoy	$2b$10$pMhFXaOZ5vJdSIuRmyaIjuhIlqX4YgpscpxOoIA32ChVNZptegsC6	ali.ulusoy@flos.com	80	\N
76	aliyasar	$2b$10$BLmTbjCu0Kyc8TBw9dadvuyD8UWx.Cbpx//YxqJEcsD3/gOlYDw9i	ali.yasar@flos.com	81	\N
77	aliyavuzkol	$2b$10$0aqELjqZ0ky6bo9gWp1XQ.sdn891zlhuw373Ac6/swgdDJux9GkAG	ali.yavuz.kol@flos.com	82	\N
78	aliyesilyurt	$2b$10$FnQlgpPPQp5ByGDLfbfN.uJcDd5/ZB/rw816PV1q6xI6MdqhkRxBu	ali.yesilyurt@flos.com	83	\N
79	alicanozfesli	$2b$10$6HMXYllnGA1e/MrM67iPb.CMDfJC/S.fzXA5yLY1Ch1A8UWcWnzqy	alican.ozfesli@flos.com	84	\N
80	alihankalkan	$2b$10$jOrylKw10J/BCwyTqlCTgudmk9jy/qpwJX3yJCi6/hztdHIbc5BJy	alihan.kalkan@flos.com	85	\N
82	almoskalafat	$2b$10$Zm0fwcGXa3Xa8CUd99jyi..xEEfg5wHy1y7d4UkWXG2YdhkOlgEy2	almos.kalafat@flos.com	87	\N
83	alparda	$2b$10$1.RE7Jihvrm3tFBnlLQxu.nRtKRdDN.NI7LIXXVJKxCXsalspqgOm	alp.arda@flos.com	88	\N
84	alparslanerdem	$2b$10$/QlcC/wHLwQwVB3F.Ex7dOgCHat.x8xDVQy4fIH9JqIMeHDpkbj8m	alparslan.erdem@flos.com	89	\N
85	alparslanozturk	$2b$10$aHyuwnWK8x4wdpyIqYf38uzM5qUHGtSVhJy1Knk5Jzd8S.x0Jfsv.	alparslan.ozturk@flos.com	90	\N
86	alpaycelebi	$2b$10$afqi8cWBJs215E7tR.DOU.B54Z6CyVQ52orMFZGyrJjNNcpFBePz6	alpay.celebi@flos.com	91	\N
87	alperaskin	$2b$10$gG.IeNSm08xReE7.D8vGv.yDEjV2aE/M1MhN8eDwPg5B1Zd6M0wti	alper.askin@flos.com	92	\N
88	alperonal	$2b$10$Pxry7p5UJOcTKpm6l6nUxOshWgPqzNkK9v9RRFtxgXjPZNH2o9D7a	alper.onal@flos.com	93	\N
89	alperpotuk	$2b$10$7ML2/zqjuYI.hJL0XC6zp.iD9AUjGcrJRGn9E26m7WhzsQMlmb22.	alper.potuk@flos.com	94	\N
90	alpertursun	$2b$10$Ysz7mB7AWIklPagVtzJD6Oy4NnQnhLlYHzErPW5y7CGHzAx3hiGJW	alper.tursun@flos.com	95	\N
91	alperuludag	$2b$10$E7P1hSMPGVBL1Hitt.O/ZOfrvSslmHwjE/QHRXiieZMNlFsa3Zo92	alper.uludag@flos.com	96	\N
92	alperaydin	$2b$10$18cfTwVpjRvmmEjSFZkfPObKn5Fllfyk9FlIgNFpgC04.hxmvS5sK	alper.aydin@flos.com	97	\N
121	cengizonder	$2b$10$MkuKUUH621hLWcl0vY/9ceiGuniTJEx/6oLp8EkLACFVlOt2pPmry	cengiz.under@flos.com	126	37
94	alperenbektas	$2b$10$N.Xm5daSBd4Glwfz9wFNguRaMzOQoQLdDg3.Gb5Psv8t9ef2Wn7cO	alperen.bektas@flos.com	99	\N
95	alperenkuyubasi	$2b$10$XvsCYYy1i7WTcD/bA8kw/OSIZpCqLLRFqTqmXkIksJR43mEvIPdkS	alperen.kuyubasi@flos.com	100	\N
96	alpereneskicirak	$2b$10$WosOAsiu7yKSWWqHpQP4yOZxzVBDwV.NhBg7I8iOWIAJyKIZ7y2c6	alperen.eskicirak@flos.com	101	\N
97	alperenuysal	$2b$10$Zs6k/LETHqPx6JzPavUxPuraTSn//CrVOwus8bp9zXT7RsmxSZEo2	alperen.uysal@flos.com	102	\N
98	altaybayindir	$2b$10$/j916bsY8hnn.v4YwXRO8uAUicb4OmRc5ljMO6om35xu4HzHgvEMm	altay.bayindir@flos.com	103	\N
99	anilaktas	$2b$10$BjwTrM45K7LRpObvJXPvZuyeP01zhCAi.WQLmxe/25tOCmc3z3t/G	anil.aktas@flos.com	104	\N
100	anildikmen	$2b$10$HKqhtHVrSI3/CG.4RnDX6eAHmf4wf47Z.cm99ZpkEnLn50hg9w9Vu	anil.dikmen@flos.com	105	\N
101	ardaguler	$2b$10$25Kdv1MRsviIiPmnISeYm.BOimsLlUiUuBEkLtM.s1AkVrJJbQmB6	arda.guler@flos.com	106	\N
102	bahattinkose	$2b$10$.L7qf438spxbzRKdB5R4.OOnSMS5IT464ugpqHSZc.uJRgBvQbqQW	bahattin.kose@flos.com	107	\N
103	bartugelmas	$2b$10$UJTwq5hC6WLYvAXxLz.IduK/JdDIxSqhmaWBaq43Pl6T6XrV3yERW	bartug.elmas@flos.com	108	\N
104	batuhansen	$2b$10$C8Nt/Prl1my1Ai2VqONGSeSdf2Vov5jsUTnhjVX8fJQgrOtabvleu	batuhan.sen@flos.com	109	\N
105	batuhanucan	$2b$10$f6w/iRb6lhUXIZaHQEK7EOh/l980ZqkosVuXvrDYNQmB7aCL5ke2W	batuhan.ucan@flos.com	110	\N
93	alperenbabacan	$2b$10$p18qCEIeWllm/2zpwLN2COyLrAv79LIM5VFPhwLnyw5MCCkrUo9xm	alperen.babacan@flos.com	98	34
107	beratozdemir	$2b$10$5KRy4lKoC01ScMBRdag21euUCfXVt5ISRn6cP.ncq6QSuq6hCn.qe	berat.ozdemir@flos.com	112	\N
108	berkankutlu	$2b$10$Ls0484uJkJfwr/gnpey/N.obUB/YL/HZT/gJ6ZjG/u8EtBque3pEq	berkan.kutlu@flos.com	113	\N
109	bertugyildirim	$2b$10$5V9ZybcGuF3lZCtu9RPXYOPpaoFeRLYTxuaH0XHUEaPLG6xTncY2K	bertug.yildirim@flos.com	114	\N
110	burakuca	$2b$10$10OgH8P/wuXktiPsQg25QegxnnxKVlW2GQFi.khEycD3XYTt2Z.2a	burak.uca@flos.com	115	\N
111	burakyilmaz	$2b$10$cBRpv41ZMuef3gk1G82bQOE9ax3GCy6sVvhr5narba7OV1ph0dYNu	burak.yilmaz@flos.com	116	\N
112	caglarakbaba	$2b$10$JbVV0X.cP27PWZ530de6nOwtBDyTvrJFSirIXHrMNKl9TggGnLe1u	caglar.akbaba@flos.com	117	\N
113	caglarsoyuncu	$2b$10$k.u8yB42/lNxV2QApTgFGeaLKo2qW8R.y4Mq3ehk8OltsaArI8gla	caglar.soyuncu@flos.com	118	\N
114	cagriguney	$2b$10$Z30FD1lw/wtcBN1BOnWWKuNkq8c5QC4Qow3Lm4lDKfojcWQaJ4BqS	cagri.guney@flos.com	119	\N
115	ckurukapip	$2b$10$sarRuThQN.cidomXyiSqq.4PaCYkwOG/EuUkBlZhMkgD2Y1WkGb9a	cagatay.kurukalip@flos.com	120	\N
73	alisasalvural	$2b$10$FCpc/2l0WSuIVu6VJ56k0e2iE8.yGVA.uoqP2ZaOPNP0JRZyaFTRi	ali.sasal.vural@flos.com	78	48
117	canerbag	$2b$10$PQPPqsXish9478O76bNYA.of.EZY/4maIuariN5UDLg5uLTJwdMaG	caner.bag@flos.com	122	\N
118	canererkin	$2b$10$yVXzLGdNeAnsoz5fFMK3S.HnbzOIDPBfP8fG5PI0M3nr49VJueYCe	caner.erkin@flos.com	123	\N
119	canerosmanpasa	$2b$10$OHJqFUz2UpQFGveOGK/ND.HlRqFGuFRkYgFVUrzS2sdEe2fAq1dEi	caner.osmanpasa@flos.com	124	\N
70	alikaanguneren	$2b$10$TZ2H9MLCk4lJW13fPKSAwe3hrhHIg7WcS8ekZh0WmzdZOGaFsMFsa	ali.kaan.guneren@flos.com	75	26
116	canceylan	$2b$10$kzgwiLb3hqbakcM9CZWDneBCy5kuytUyUfTPxmYb998ciXJDBKCBi	can.ceylan@flos.com	121	39
122	cenkalkilic	$2b$10$krQkmcWzGvRFk5Ozj9NGtuBLxnBMVe1ZGP8/lPP8OY2xRIyiK3RHu	cenk.alkilic@flos.com	127	\N
120	cemkablan	$2b$10$V5/J/1p5qg2hKjdClRrC9Oxe1VNj.rBggmfyb6UQTpM7H7b/bYMD2	cem.kablan@flos.com	125	24
123	cenkgonen	$2b$10$bJTSigUK407UfhCw9wrqTO2GuAaHQjKbnrk4wCbz5CZasZcu8UzIC	cenk.gonen@flos.com	128	\N
124	cenkozkacar	$2b$10$pYakVu8I1HodTbXJYW5e8uwBBY4VNAPyQFHWPFBtjb3SmIpcGHwRK	cenk.ozkacar@flos.com	129	\N
125	cenksahin	$2b$10$SkhByDvYoZOiJ07HQBJXCu5oTsp7u.BM3pPC7CwewNziJcHaMPYEe	cenk.sahin@flos.com	130	\N
126	cenksen	$2b$10$cKbQCtn9aUB5/ztCr/WKfu9/I7CGd02O7kwG6PllLwChWcE4dnAPq	cenk.sen@flos.com	131	\N
127	cenktosun	$2b$10$Udz1vYGCmOvldxr9/Q7UxO11gdN/q.yVQS7LWJ2j5hxDLYpz0NFcC	cenk.tosun@flos.com	132	\N
128	ceremdincer	$2b$10$3463XfrnRcGDS2Tv2wEHjOwk0sCdjOHIoIvEXy/VPGNplTpanlNpO	cerem.dincer@flos.com	133	\N
129	cevatcanekinci	$2b$10$bnIPKg3gSqqZWnsNH1at5.1fLrGqFVhK2anmuaMSmrfLgEMbUBRcm	cevatcan.ekinci@flos.com	134	\N
180	erdidikmen	$2b$10$ciNOenlu6XqAkV9bL/Ic5OhoKZg7EFgvZsoOe.NjJnMJn61H47bJO	erdi.dikmen@flos.com	184	52
137	denizhummet	$2b$10$IXaqTIi6vfuijMkdJ6PfnOLnTtJLF1jY69IsGh.u8G4GJty8ze9La	deniz.hummet@flos.com	142	43
132	cihantopaloglu	$2b$10$fVGjs4mQDx7nJmuFppLdZunUXdZenXhBL65JUiSkR2coURRtdJpAi	cihan.topaloglu@flos.com	137	\N
133	cihartarhan	$2b$10$cVKRZ7uxvO/v4Ya/uUwPTejSWKYExH2W4.kgJgjN6lGzQ4YJvmvKi	cihar.tarhan@flos.com	138	\N
134	colinkazim	$2b$10$CMvIbNjdRHni1tvAnOmwzO3HmUiKkq5yQYRASDVPO6kkpo1kM71Zy	colin.kazim@flos.com	139	\N
135	demirtiknaz	$2b$10$ubTFZTsW7hor7HiimdYZUu/0.7RalOjZ0ILSg2OmKncxm9uKYBK3q	demir.ege.tiknaz@flos.com	140	\N
136	denizdogan	$2b$10$UpH6Z1L5sf/.KNX.n3uWRO4UCTzyfjbEuI2nFvVuvp2Be8yyw5VsG	deniz.dogan@flos.com	141	\N
171	emremor	$2b$10$BLRUjTQRv3S1q7k8J.vRveOJpYU8xF6gWGU0P.F4HtsOd0yo89KF.	emre.mor@flos.com	175	54
138	denizkadah	$2b$10$13O17YFx8dg2BMp.H9o6EOZRisS0IdId/u3Y3yyldPVR.VoTWfn6m	deniz.kadah@flos.com	143	\N
139	denizturuc	$2b$10$j9rHGnj871E4wVlB5GOjOu5yg0OBx9PQsONvukrDAoQnwnWXyM2dW	deniz.turuc@flos.com	144	\N
140	denizvural	$2b$10$BWecFpu42cyadKqqWn1BMuwBeBOtaY28f9cCSgQlcrr6KL6m.8rLy	deniz.vural@flos.com	145	\N
142	dilaverguclu	$2b$10$Wdy/ThioNgXh1KOZIizEk.nQbOIK1nB9PDqL371lpbkW54r7cXVG2	dilaver.guclu@flos.com	146	\N
143	doganalemdar	$2b$10$jWkOyZ8sscwpthjE8u0u8Orb5Dzs4H1ZHy7ktK2Ne6/bl2l9YlbEa	dogan.alemdar@flos.com	147	\N
169	emrecolak	$2b$10$UNX1uBGoeFRHrug2Ws3fmOg.QGMq0luQfEyDHpSsZEGPWu6klM9i.	emre.colak@flos.com	173	25
146	dogucanhaspolat	$2b$10$SgtZuLoo7/qen4GyP6vIT.sdXM7ZT8hKiBTQ5vPFwZyrhONnwZvmG	dogucan.haspolat@flos.com	150	\N
147	dogukannelik	$2b$10$KpAwSPXS64r7133ErvOY7uPzbu0QYPUY2sRy4hcMUBSD8JNV4F5U2	dogukan.nelik@flos.com	151	\N
148	dogukanockan	$2b$10$1RJo9XfJvvBsbssP8rjqKOznnyJn./pHVaUt3/y2ZEVUmctBgG2Ga	dogukan.ozkan@flos.com	152	\N
149	dogukansinik	$2b$10$x4MWZ/wWcyXtisSOIubCZer0pjhRs6uLWzh27xIq3z.Sll7gb4IMG	dogukan.sinik@flos.com	153	\N
150	dogukhantokoz	$2b$10$IzNb6FMo5r3RvTooEjls1.yJ7HpEs4qZbi40mp3w2ZJObkd60S29u	dogukan.tokoz@flos.com	154	\N
151	duhanaksu	$2b$10$keuHY0vF5TGLDaNi03CJg.6avOFfTTAjtP59FTs9fw6Uwba/7pL8O	duhan.aksu@flos.com	155	\N
152	efekoyuncu	$2b$10$d7tPqLet8PvzZxz3cd3BzuvEZlc.fL1ziCmm6/4//mBuPX1XElF3u	efe.koyuncu@flos.com	156	\N
153	efecankaraca	$2b$10$YsCoYKQZrDkBmayCZukDmOPRva8/r.oAOX6fb798EDNK.7U.GT4Ju	efecan.karaca@flos.com	157	\N
154	efkanbekiroglu	$2b$10$60eK0kJDig/0sWMaWzDR1eYLV5zdQf3JnhrFOUhsyT4vhZRZRhIKO	efkan.bekiroglu@flos.com	158	\N
155	egebilsel	$2b$10$SK0pYranSgDX7VmCLFD4xOTYYoWvPnJFuzbD3fLZPFw1UGwJWokXe	ege.bilsel@flos.com	159	\N
156	egehangok	$2b$10$xJ0F/DxgFtTzSVD/xUmIBuJaBXcjnJHtMP41VHMDyZ8djKWCVn1Xq	egehan.gok@flos.com	160	\N
157	egemenkorkmaz	$2b$10$Xnc1c5q4g0V7zEUvfG0hS.l5T7L3djU6TxxJY4dslx7CXV98brgja	egemen.korkmaz@flos.com	161	\N
158	ekremkilicarslan	$2b$10$B1kBI2Oe.In.FEq5BHHn/OQ0OGOtbIT2GKJvtH0ZlojGjXN9j4H9W	ekrem.kilicarslan@flos.com	162	\N
179	erdalkilicaslan	$2b$10$pI4rMUkJG4I4ogNZeZ/3U.YF6txJbLQJgHVyTEUL6iuDkxSbzU0ny	erdal.kilicaslan@flos.com	183	33
160	eminbayram	$2b$10$1G87BYlLvA0OlWQM.oG.h.ripsTB9VCkFVKdz.7QlonCaXKZD9fyG	emin.bayram@flos.com	164	\N
161	emirgultekin	$2b$10$SwnQHLRVBps2heROHlf0ruYR3aEi4z9OWPTmIqo91vIFDf7g0RmgO	emir.gultekin@flos.com	165	\N
162	emircanaltintas	$2b$10$8H4vS9yoRD9uMxUMHeK37uzrAikG6ic.tPkXln9EyFzBK5FoEqM1C	emircan.altintas@flos.com	166	\N
163	emirhanaydogan	$2b$10$FVSxSsmtcR4TvaBH7F5UAePssf0WEDljYIBGQGiysPebPPfheT88O	emirhan.aydogan@flos.com	167	\N
165	emirhandelibas	$2b$10$4FrJN.bgznWy59BRuXjGeuPg1mVYkAZJGUkn8ZZQXeQUrzhVgEkN2	emirhan.delibas@flos.com	169	\N
166	emirhanilkhan	$2b$10$dpL4CTHgLxsTSkiQTcEro.bjrZnr6qKfCXKxeWrjF5rpCK9l5SssO	emirhan.ilkhan@flos.com	170	\N
167	emirhantopcu	$2b$10$cYF8CZgNcIyRdP2cE482HOgKp8.z9oFpSrHrL03KRLGJt3ak08xeO	emirhan.topcu@flos.com	171	\N
168	emreakbaba	$2b$10$cGvGd5tmzlvOxOqN.w7yJ.7kfi3SufdwkCcSKvpX3G3pvE6KKIbhq	emre.akbaba@flos.com	172	\N
164	emirhancakir	$2b$10$RabpaV0hkdOijfWHzYxWJ.j9lpruPcoNdaEzhZZv.3SMKOwTkovrK	emirhan.cakir@flos.com	168	30
170	emrekilinc	$2b$10$IITCArAYLQ41muDNNyNvz.jUG/dhOcVbkSl7C3nKEUMF7DY5IIoV6	emre.kilinc@flos.com	174	\N
144	dogancandavas	$2b$10$9pZXcWNGBiFq4VhTT5W47.uRPZigMetkk9HjeV9WLJ0mWDN/8of9a	dogan.can.davas@flos.com	148	57
172	emretasdemir	$2b$10$nhYNG.Mc2XIu4QFD4Gwax.b1yj3aK6DRninBaHxD/SxcJtJpfKNpC	emre.tasdemir@flos.com	176	\N
173	emrecanuzunhan	$2b$10$jmWo4lw6M4wKsVnhFUB7k.UQMuY8Ajso8t.iKDCwEVyBWbS1Lp9FS	emrecan.uzunhan@flos.com	177	\N
174	enderaygoren	$2b$10$mJiUH9dTSkyAUnR46d2QquCaW7NNayrLrU82wzblHnE5q57oXVCmy	ender.aygoren@flos.com	178	\N
175	enesunal	$2b$10$QdL9gwg5BfgkBqq76QzL4OfT.bB6sC268TO6Ks/WUkk5Li7/ERxF6	enes.unal@flos.com	179	\N
176	eraybirnican	$2b$10$.eFE.fFtZVzFEEjZZQVwC.O2v8yKRvxV94UHPWV/wsce8qTqtxXRu	eray.birnican@flos.com	180	\N
177	enisdestan	$2b$10$7cs2wp.D8HrXpxL02DkVW.knqdrs/CalfB6YBhFRHhWDzNObBSexS	enis.destan@flos.com	181	\N
178	ercekardesler	$2b$10$3cV7nA4nQwDICoFOdG5NX.aJswkaxHLdN7dTm4kWgKwmXpi8HFx3e	erce.kardesler@flos.com	182	\N
131	cihankaraman	$2b$10$O/tHwCHD8ruB4H2lsdZvtOewEBzYsnrg4mtj8hGuQZNe8/D2lR1GC	cihan.karaman@flos.com	136	35
159	embiyayyildiz	$2b$10$y9NV/cV60j7QMCDCHvAIxenHPhxLdJIGjC0eF8GlchqSDzmJa8Z0i	embiya.ayyildiz@flos.com	163	19
145	doganayaygun	$2b$10$XnOlZXK/RmJwrun4TPjC7.ASDLGCUkDYwnYjti1BaumDg/zXa7Y0O	doganay.aygun@flos.com	149	20
181	erenalbayrak	$2b$10$BoEFXGXAiAdVV4/fCFumBOWOyPeU1dCi7E2hiofj.WQ/YWiANsneu	eren.albayrak@flos.com	185	\N
182	erenbilen	$2b$10$hX0OnDBf96zJhnRhcUt3dOjR1oewU8mfhGzSTU1CjBUjhyiDn5rma	eren.bilen@flos.com	186	\N
183	erenelmali	$2b$10$uXYPn5bd0aFnjqL3HwL0hOdkZ1dfFlynW8vjOVlnOQvtChSKtDn/C	eren.elmali@flos.com	187	\N
184	erenerdogan	$2b$10$uj353YcI0I7egQifL2ZDPe5A9qYOpTgbHzMgROdQtS8Mq403fBWoa	eren.erdogan@flos.com	188	\N
185	erenkaragac	$2b$10$P23qacaZv4oNm4H1SaGjPeg8glblYaG73R6cJ4DxI8OXc8kDVofbC	eren.karaagac@flos.com	189	\N
186	erenkaradag	$2b$10$ZXZnJh2Ys6qUIhXvfM2Oxu7HEarb9R8WXWuA.68ID29F7wlHOqDEi	eren.karadag@flos.com	190	\N
208	gurayvural	$2b$10$5.km8GtQkyr4YgQ.6VpSCeozjZfpvVww0NTxa4DNnRVD7vkiarISq	guray.vural@flos.com	212	\N
187	erencanyardimci	$2b$10$4C50qhBztIInAMNr5Nc2Nugd8QmX8eEnjyjPfttUYfg/D70DocIN2	erencan.yardimci@flos.com	191	\N
188	erhunoztumer	$2b$10$v0rWzyu7h55vT06oUQj/2OJEc3ZnyzN4py223eLMs6jbF.x2zQbz6	erhun.oztumer@flos.com	192	\N
189	ersindestanoglu	$2b$10$qX3vKVSShLyNPFrhHHDnz.u9mofLedG1lUWEbppMpBCdgNMwrAXvq	ersin.destanoglu@flos.com	193	\N
190	ertacozbir	$2b$10$cd/mQCb6YFDytGHPRjfhxeHdcVwJ.Uxx4s7CwX/yxzAgTsGb86QjC	ertac.ozbir@flos.com	194	\N
191	ertenersu	$2b$10$rN0P7RkMZelrulI/3uUtxeNJ6P9xOpayyDIsTY922t6ZpiCpBeWZW	ertan.ersu@flos.com	195	\N
193	fatihaksoy	$2b$10$3Z6mFBagJpII9MC.A0EHBeAv0OkK2OQKinNXuf2BeNcAWl4Q1K6AW	fatih.aksoy@flos.com	197	\N
194	fatihsanliturk	$2b$10$BkkFiG2pBRyISPGd1JmcR.XYiRV71cYWY/V00Q2GOCUB29kZ6R2m6	fatih.sanliturk@flos.com	198	\N
195	fatihyilmaz	$2b$10$Mhli./FiApVabt6Xn3r.GO5jm/MuOtuM3RRb/O0Qp.578rHUIWbJO	fatih.yilmaz@flos.com	199	\N
196	ferhatyazgan	$2b$10$/Jnz.slJBaxzWHgS.GdVp.Omq97OffDj8m4UMTlcjqoWqhqyDSV0O	ferhat.yazgan@flos.com	200	\N
202	gokhanakkan	$2b$10$VzCa6vTGgJkW1nTR7zfVSuWtDjEIFdG1GODGPFYxj99EhXEs6mai6	gokhan.akkan@flos.com	206	23
198	furkanbayir	$2b$10$nWITEgUpQNffCd7EJkjf7uyzDc6yn2gEEHNs/f3UoeNyxYCL4Ao4S	furkan.bayir@flos.com	202	\N
199	furkanbeklevic	$2b$10$SwnwA4EW9CzsqAU8brFv2ev6xzOH.CYjj9GQ7ak3n1iLGOq6xY.wW	furkan.beklevic@flos.com	203	\N
200	furkansoyalp	$2b$10$DqJP///fs1EgNULyMtcs9.AEvyTJQbUHc7dsaHo0stqHRuNPhMLiK	furkan.soyalp@flos.com	204	\N
201	gkdnzbayraktar	$2b$10$AFjQsa3GjXRdcSqwXQ9QSu.WsIoM6Is6OAoPWDqp6n.WmY8.jrrgm	gokdeniz.bayraktar@flos.com	205	\N
224	ibrahimyilmaz	$2b$10$JX70AvXe/G9ccc9WXKZzjeGfIJacg8piOeZNawx7T/eddSjblwRB2	ibrahim.yilmaz@flos.com	228	41
203	gokhanaslan	$2b$10$NvbkJu/Wx5NNf9FBUizYmOmy.9iyq1VouNqLwLMXGbdao11OOHLC6	gokhan.aslan@flos.com	207	\N
204	gokhangonul	$2b$10$mG/ofaUGNNWLsoJ.dFgepOGmVPxXHY6.XnzrUhDt1QjaiEVsBrYiW	gokhan.gonul@flos.com	208	\N
205	gokhankaradeniz	$2b$10$P4rcbgrmIvrwrZspfWgRaeSS3HIwZqjJOKKdSvBX4r.VSyAeLppkS	gokhan.karadeniz@flos.com	209	\N
206	goktangurpuz	$2b$10$6pCPbNkTo3p2w2D8hNpGMOeNmz5BwtMsYpBNsYcngNpnsnss04dO2	goktan.gurpuz@flos.com	210	\N
192	ertugrulersoy	$2b$10$0HFldBIzyQ8/LgsPFyZNRuflDn1MktQSxuwAxIXBIQ3FKStBM1Xt6	ertugrul.ersoy@flos.com	196	64
209	gurkanbaskan	$2b$10$ITFIoRU1VSFKDT9koOdVGOFXHPFCy.p7VgzlCueNwWY6X9vMNtjDO	gurkan.baskan@flos.com	213	\N
210	guvenyalcin	$2b$10$K9snyBesiUwxCyxiCfWTruykogXkCyfdtKA/86EUbsrpayREuq.kO	guven.yalcin@flos.com	214	\N
211	hakanarslan	$2b$10$Qph5JLrsqHtvQvHSn3GAwOoWcRkIssbF8GkFtoYP8eAHwBePiAfAu	hakan.arslan@flos.com	215	\N
212	hakanaydin	$2b$10$PGeacQppGRT3ErtamFIY6.nlXgLcreCxCXsDZROLopxY9d9nU2HQ.	hakan.aydin@flos.com	216	\N
207	gunayguvenc	$2b$10$5AbaoX5mAwdlNr2p9i6CKOB7XY8mDd9WwLbhGjgSc7v3/OMa6Z40K	gunay.guvenc@flos.com	211	60
214	halilakbunar	$2b$10$TpmBlsVbUNR8DX/7CdxAxeNxMBMN6zDbplP8jCSZbHuHRPfoC59SW	halil.akbunar@flos.com	218	\N
215	halildervisoglu	$2b$10$1GOwh7dE24FZ1X/fxCbsfep464aHNGn4jibqOQHURrn3IC06MOlPO	halil.dervisoglu@flos.com	219	\N
216	hasankaldirim	$2b$10$Q32xd3AUNc3gLpPybR7ydOSItYJJwJ4bistpTKvGjMq693AvZhhOa	hasan.ali.kaldirim@flos.com	220	\N
217	hasanacar	$2b$10$xyXoRKUq1jeqE7koM3Xqm.JbAseapLGplF2nmHl5RL84wkmIxeSgu	hasan.acar@flos.com	221	\N
219	hasanyurtseven	$2b$10$VXepVJuS9nG6Np1b.Xr.1u0jywwoI6X6tmVPJq/w.td3h.J14aLIW	hasan.yurtseven@flos.com	223	\N
220	hayrullahbilazer	$2b$10$TwR7hVdmbFIogXvWLvnOquEYl0yoiPwVjMVqVNclGf.tpjDi8DhlS	hayrullah.bilazer@flos.com	224	\N
221	huseyinturkmen	$2b$10$KQGLJ7Q..4ciZOvy1DUUYu9r2vvznf59d3Imhch2BoO0jFSy7Regy	huseyin.turkmen@flos.com	225	\N
222	ibrahimakdag	$2b$10$k29ZvEd1Nk1SkWxCEbaR8eqCKNfALWlgRFg0EP60uq3YlBkMJB2Eq	ibrahim.akdag@flos.com	226	\N
223	ibrahimpehlivan	$2b$10$bqVvtRHkk3PsRD.9qHVRWeLL39AamcqktImKmjuCOmz47WDO9jrha	ibrahim.pehlivan@flos.com	227	\N
218	hasanozkan	$2b$10$GUewNNqj06UYVxqFV..dmu2m4MhPIybBeflgfnxUz24dX7e6Qnohy	hasan.ozkan@flos.com	222	45
225	ilkaydurmus	$2b$10$B2xkJoPL1t.WkoLIX3TmbOgEcZIZyNxzuUe93BrQzyEKq9pTFi0hO	ilkay.durmus@flos.com	229	\N
226	irfanbasaran	$2b$10$QMjtVBx6odomQ4zWtvYQmeVcBJlC4RYN4TEORxxFktuvphGWgtp9S	irfan.basaran@flos.com	230	\N
227	ismailyuksek	$2b$10$Y69FOlvIVhZglG0Fjgxe4uT8mAStmyuqBp/FueQyBPrGlvraM279G	ismail.yuksek@flos.com	231	\N
228	ismailzehir	$2b$10$DHKMiVpBkZcfX6xBdAvm4.FpO515dmXEiijqD2505DyjZ6R4Ndup.	ismail.zehir@flos.com	232	\N
229	irfanegribayat	$2b$10$JcMRkLK3fzyd/yn/MEcMl.IO346BN5GG8GGnoBBuV..amRyKlCVoC	irfan.egribayat@flos.com	233	\N
230	irfankahveci	$2b$10$4zdEQLhvNvjv1HISq8xbHuULCHDCr41uItf63aFs84bc1gN0L9Za.	irfan.kahveci@flos.com	234	\N
231	izzetcelik	$2b$10$pWU28Co0vdPNCaIRWHTrluCpWzXKfyiFM/NktmaEq7n6HALLhRKe.	izzet.celik@flos.com	235	\N
232	izzetkaraboga	$2b$10$baRB/3Qd31KfDBgt1Ki6meLmpXTV2AbSdsaIPdJs9RHcBJXpfE1gy	izzet.karaboga@flos.com	236	\N
233	kaanayhan	$2b$10$ASBJlgPMh0sSlzS2gEEzKuXDDCc3VmTRxMkNHazJ.qPTc/dPGypHe	kaan.ayhan@flos.com	237	\N
234	kaankanak	$2b$10$kqV7mKwOlwP.DJYrJW10.e4nED8LcV8y8OzhSF.0fDdo1jENcDWqW	kaan.kanak@flos.com	238	\N
235	kadirseven	$2b$10$GD4DGs4EaHkPjAPg4o2R0.FOT5sMv04kmbgajZNfvuv.Vyf0q1S8e	kadir.seven@flos.com	239	\N
236	kaganmoradoglu	$2b$10$sO2G0zZG5x79I9qdaOjJeOTVz4he/6dwnqF1zfLCx4W5Lo8lTwEAC	kagan.moradoglu@flos.com	240	\N
237	kahramandemirtas	$2b$10$XchGdLqhFGA0FARH1yTC3uvR5Fs7njZ9t33O0F2dpG2V6CTOwjNdy	kahraman.demirtas@flos.com	241	\N
197	furkanakyuz	$2b$10$zYBQGpMjdQeF3.Y2iD7Kd.N6Oj6pcE8Na91GNFHEubGZgjgKdLGMu	furkan.akyuz@flos.com	201	16
239	kazimcankaratas	$2b$10$vpDwYlehUf6BjR3kAzUK6OOeBHyjCFkjkRkI3qmL5RdouoGVR8ZQG	kazimcan.karatas@flos.com	243	\N
240	kemalaslan	$2b$10$pMDfM0gfg8Nvj0YiyGi4MeCcgKguuJYTB9Djh/h9VDT5DQ7lUSBSS	kemal.aslan@flos.com	244	\N
241	kenankaraman	$2b$10$3mI..2TS/7JNbL3XFpa5/eS8xkmwpZNjZu4zxaTfNA1hOsagBDE.W	kenak.karaman@flos.com	245	\N
242	kenanyildiz	$2b$10$.EwMjC/TAj25jsx3dmEQq.t7iUZLzNNMqMyO2XI8euptsVm40hv1m	kenan.yildiz@flos.com	246	\N
243	keremakturkoglu	$2b$10$6uuEvWVlG2TpsIMxVDzK2OtM8O4YjjR6GpXivsLHLrXON.YE8O6XS	kerem.akturkoglu@flos.com	247	\N
244	keremkesgin	$2b$10$G988CzVtgwTt.rR.8bzDj.CVFr7NJG2RdqmSRyweaFQyR5HeMOVOW	kerem.kesgin@flos.com	248	\N
245	kerembaykus	$2b$10$XEMhBlG1EGxy4hdJwfU2YOiZYskIYPtxYB9AWsDCe/wnoX/TeftWK	kerem.baykus@flos.com	249	\N
246	keremkalafat	$2b$10$3Uo00G3GEPTnGZTBbp6QsOoTgPFlj6/OOHfkN2rXqfemxckH8/9Dy	kerem.kalafat@flos.com	250	\N
265	ogulcanulgun	$2b$10$fvCtECAfuV1.IPiFl9bCn.fyuZQAMk.5b30Wb7qixHl09Ucm.fmYm	ogulcan.ulgun@flos.com	269	\N
238	kamilcorekci	$2b$10$6asxVvj7lm4jszEylQ5hee6l5qlGoCLqaz3adefuZ43FcItwOk9ju	kamil.ahmet.corekci@flos.com	242	59
249	keremsen	$2b$10$l/pnmWdnSWVfv06F6rfyk.LfiAVT4IaD5235kZ2nOFoWQKqMkKOvC	kerem.sen@flos.com	251	\N
247	keremersuner	$2b$10$iza/ToEJMdi6HMnl2VASqe4b/qYMMk.5a1YzxHP0LiqQSJzMYI8Re	kerem.ersuner@flos.com	252	\N
250	keremdemirbay	$2b$10$EpL84V8zd0JuoJQzFEpGbuY44xkjG66QCnheBGSV3p6ilb5Pt36GS	kerem.demirbay@flos.com	254	\N
251	korayaltinay	$2b$10$SvYNnjsmZEVQhn..JANUQu.xC3Jg8zSjx7QZqMJA4X.fr.oG/0u7C	koray.altinay@flos.com	255	\N
253	mertcetin	$2b$10$lEXmIgmzr74OZUI/IR1qyO8bGLIiebO9gGTjVcoPXIWR7yBBMS./2	mert.cetin@flos.com	257	\N
254	mertgunok	$2b$10$zmgnzXr8LDalXujTQAHr6eiwfO3iK632ucFM/i6QNNk5Fmx1F1Ko2	mert.gunok@flos.com	258	\N
248	kerimfrei	$2b$10$dUAd05nVhEJu/ihwFJsaQuRiaU/DWwBfZoWP9FzLvGpiIsBnfiekK	kerim.frei@flos.com	253	50
276	ozantufan	$2b$10$TcMFhurqoLEkZklo0qF2BelO0k7w1.9DH0V/cZfO37uQrdL8i8kGi	ozan.tufan@flos.com	280	27
257	merttopuz	$2b$10$xL8B2peVfXYERU2yjGccDOd0RofL3CGsiNp/BbPnlY/oE/a/zOhPC	mert.topuz@flos.com	261	\N
287	samedkilic	$2b$10$gaINTAN5Opo16BqHKRA5quo3D.oq4ABoGxET/w4uN9zOoWxcCIfT6	samed.kilic@flos.com	291	46
259	metehanmert	$2b$10$WJWMOHtGQduve6g2p/ple.OI97Dl68Em2L2esmVWq192avs2uhDPq	metehan.mert@flos.com	263	\N
260	muratsipahioglu	$2b$10$sTVtq4yJ7As5qY7qrWRuROL2QeFtidvPxUd4uicmwxG1zsKlHG9GW	murat.sipahioglu@flos.com	264	\N
261	merihdemirel	$2b$10$nNSZHzKVJkzTq5ldbixSoO9fAy2s/leAM41ihEU0taZKel1CIkYCC	merih.demirel@flos.com	265	\N
262	nazimsangare	$2b$10$EMx/7tP1wvcCvtsjgWkgv.RR/cw59pfpO8T2MNsw0bG4O.wFrCcFe	nazim.sangare@flos.com	266	\N
263	necipuysal	$2b$10$v.k21AX2jva3SgoodcadG.ywT40F0PZ1hn4aMuWZdZkND.lg2/vSG	necip.uysal@flos.com	267	\N
258	mertcancam	$2b$10$jF8H6r/xavJroj.Bgb6V..bkogByh9mJS5fBSZ0zbDBldux4MDhG2	mertcan.cam@flos.com	262	42
266	oguzceylan	$2b$10$FGmqsNnJ4JRyZwcDX3TgpuIvx7cWZIKz6sesdCY7WlPu38yt5Jxwa	oguz.ceylan@flos.com	270	\N
267	oguzhanozyakup	$2b$10$fpVvfNMcthEvHhbAXMJrmOQ79IsTNNVN57VxmfTD2llSwvYlsbuOW	oguzhan.ozyakup@flos.com	271	\N
268	okankocuk	$2b$10$NTI9RtALEjZxm82NIMfHeOg3Fj1hqBM83jwfYTJjNqXh.iW5GISPi	okan.kocuk@flos.com	272	\N
269	okayyokuslu	$2b$10$aizNaPLgzJe808X6V4Vn9OAcyIhh5x8ElhOOZJYDMrYMqsqYLB8XG	okay.yokuslu@flos.com	273	\N
270	omerbayram	$2b$10$eiU7SzZj1x6A/8d6oNUQuur1I9CzHlhrslXnL/scsCzUHgUTPsfIG	omer.bayram@flos.com	274	\N
271	omerbeyaz	$2b$10$R1tSnorUxnHhhYBbdN6lAuWDPT89gVDyjbcJaTWKsaLiEWaBF9nJ.	omer.beyaz@flos.com	275	\N
272	omertoprak	$2b$10$Vx7uxQSpG0VKhXsutARrKep6T11kvGp1Vq8bniXz/wjZF5b0qMl6C	omer.toprak@flos.com	276	\N
273	onurbulut	$2b$10$ZXDxiUy24wa.8XTGvuChoO7od9VaDO3.aRjm6k25Ttm3Q.n2sT2Oe	onur.bulut@flos.com	277	\N
274	onuralpcevikkan	$2b$10$1aaBb2PoYqsC4kSUWNpaVexjxmLEryHvIK.2.mk1Y4aAsx1tL0vH2	onuralp.cevikkan@flos.com	278	\N
275	orkunkokcu	$2b$10$bbZJEMu1Z8O8EYyjPeFnoe1mh4cTWtu1.PU2jkD..vIxIjb4EEPp2	orkun.kokcu@flos.com	279	\N
264	ogulcancaglayan	$2b$10$LZNMdr7EOqGi5yS6ZVJJ7eCVIi9GiiTpzVZmdMdiOZNeLZVs5rHaK	ogulcan.caglayan@flos.com	268	38
277	ramazancivelek	$2b$10$9MGCnb7hFnatVNxQhFbmHuwseJgF8bnwJLjHGRX59xnDt47/Whf7K	ramazan.civelek@flos.com	281	\N
256	mertmuldur	$2b$10$WemRT0X98.j6r.FNlDIm9O2bTNJp.u0PhtWFfrk4kfYp32Ytfyp4.	mert.muldur@flos.com	260	22
279	sadikciftpinar	$2b$10$5Ni1txpA8AivAFOVjeugf.wsinVlDwjp3GEDrEbNQ4kpXNAT3mcBK	sadik.ciftpinar@flos.com	283	\N
280	sefakinali	$2b$10$4gRfUKd5GEAgV4Lw3eAfD.8TVqUHIvH7RQsnCDlZO/izpRaXo/Oa2	sefa.kinali@flos.com	284	\N
281	sakipaytac	$2b$10$OO5L19oAXOlC1yssyf/LiOqIQSZR5JQaG16ZLurRlip6wW12q6eHC	sakip.aytac@flos.com	285	\N
282	salihdursun	$2b$10$G/wkMm99GE15H1Snxe5QGeMuQ.pFsj78g5rph3io0fkeVt0xFUEgS	salih.dursun@flos.com	286	\N
283	salihkavrazli	$2b$10$hwk0Unk4iGz8.H7fEED.e.fyn/.iRAw5zqcf73mkoNiTvqxz6YGCa	salih.kavrazli@flos.com	287	\N
284	salihozcan	$2b$10$DhRR962DkxgOaQ1uOJq0zeO5RTnWRQQfowOGvTJMdUh.4Z5pJq9iC	salih.ozcan@flos.com	288	\N
285	salihucan	$2b$10$JdNz1R7QiJjOYJ97.wqQ/OuYbM07JNDN6seRD7/eq1c..G4kiQ2de	salih.ucan@flos.com	289	\N
286	samedkaya	$2b$10$C5LBZAvST3yFlmaa59X1C.HCnB1JOOXJEJIYFo6rSNMclkY8cOHLu	samed.kaya@flos.com	290	\N
255	mertyandas	$2b$10$FRZPk7aXEGRyNoCABYU1uuAsSZjKX3zn8bojFaCrG7lNavXfLlSc2	mert.hakan.yandas@flos.com	259	47
288	samedonur	$2b$10$aDrrJvX9YA6UpxEFt/pK3eh9wi0T5DeRemIiFXHF4ogfo1QMa21M2	samed.onur@flos.com	292	\N
289	sametakaydin	$2b$10$dOp4E/J0PxjQfY5jX1YnCueFzd71zM8425pu3OyFiOmS6IKQCBgIy	samet.akaydin@flos.com	293	\N
290	sametcanozkan	$2b$10$wBGamAA1gIwTdoKKgvQMOeCRdwo2VzeTYiq1BRSWRnyB5WpgV09m.	samet.can.ozkan@flos.com	294	\N
291	sedatsahinturk	$2b$10$WuaLKjhE/OmbF/5jFRWLz.evJ7/QEs6aHXJW/PcI70BQ3yjNmvkki	sedat.sahinturk@flos.com	295	\N
292	sefaozturk	$2b$10$FA.ZC9vY3aitTGQ34eAy6eDMbNJ2tAxJOzgjimJIjgOo2RKfAMacS	sefa.ozturk@flos.com	296	\N
293	sefayilmaz	$2b$10$1M5FwpYCqrbZIgh4VPlHyuMRSk9uYlxFFz22D6wst.zaPZMnePXZq	sefa.yilmaz@flos.com	297	\N
294	selcukinan	$2b$10$iMAmxDBfV2A34tmAt2eOauyhdaXzSwcp2yG4rv/YjevFKiaEliH9C	selcuk.inan@flos.com	298	\N
278	sadikbas	$2b$10$X82J1I3CBodvi90bEt/vNeKUKqOAthDd.e1lB/E4bDZIkEi9L2QBe	sadik.bas@flos.com	282	21
252	koraykilinc	$2b$10$1ALWrqPw8JJ4v/hmbqMG8eOT2repSgxmWxne6xvOqkSp7meO3uZFu	koray.kilinc@flos.com	256	63
295	selimay	$2b$10$gw/iT66XPpAc90hngH.VbuBX/sFEgQWm5TgasLUY69Xmiq2z6oX1.	selim.ay@flos.com	299	\N
296	selimcantemel	$2b$10$Ji.K9s./uOCUPGZd7Euuy.pjmm3sRprzc8ZLh7UUTc3P0rjgHbpvO	selimcan.temel@flos.com	300	\N
297	semihkaradeniz	$2b$10$U1vaOzGFPJ.yGHjOhgW5KOnOrCTmdlEoqvaAUiJB0tS3XN28okLEG	semih.karadeniz@flos.com	301	\N
298	semihkilicsoy	$2b$10$yrqkBxGZsun9LEBmUUqCB.CdaiMERPX7Vt098pHFMv9mL9Z26dpoy	semih.kilicsoy@flos.com	302	\N
299	senerozbayrakli	$2b$10$1IRJlZI8LPnJcjC/FstYuersbmCbdv3kgvMMfHm3sHgsF2XqLS/sq	sener.ozbayrakli@flos.com	303	\N
300	serdaraziz	$2b$10$O.JbdVWvo43otFDLCibWdeww3.DFGfAnt645TvcxKxdCSDOp.HJv.	serdar.aziz@flos.com	304	\N
301	serdardursun	$2b$10$gxtE8fDTqJ6ENWPyzLUYlu2zp57aEWLwrwbKUrWvvChH128Mh71GC	serdar.dursun@flos.com	305	\N
302	serdargurler	$2b$10$W7LSeqbxWux8fR0mThvGyOrl7acHXKZqLKofyYqFRZ2eJgtec0RsG	serdar.gurler@flos.com	306	\N
347	volkanbabacan	$2b$10$s4oTArzDYhT8djYiingI2url431Zqm1IrwvLvS7beGJiZcfP5wyWa	volkan.babacan@flos.com	351	29
304	serdarpoyraz	$2b$10$STNVG8p48zEqQXA1TYq4tuGtHCO4sucImduBa5Pw9DM4f6mELbpL2	serdar.poyraz@flos.com	308	\N
305	serdarsaatci	$2b$10$ETUoUBPmugaM2AFuBZmw/eYzeIWbkn/9vxFIUtCY6b21QwxmFqTIG	serdar.saatci@flos.com	309	\N
342	umutmeras	$2b$10$KOHBMy4ypIzbPWPTymrRT.jaemNji6p1ldbl4FMdVxP0U/wKVnkbe	umut.meras@flos.com	346	40
307	sergenyatagan	$2b$10$E9xCBcszvjvYFcHHnJ0LvePymLEK0y7AHPRAiS/2JOTVLbOdiJugi	sergen.yatagan@flos.com	311	\N
308	serhatahmetoglu	$2b$10$oJGpK1t0pe/IANJCoCGrx..LV9bwfF1tXYOhYgKq3IwDMzxy1YY4q	serhat.ahmetoglu@flos.com	312	\N
309	serkanasan	$2b$10$VtieNj2xKeYvsW049EVQiuEysuoQXTkOqO9jhehkp6L4hAcf.dcJS	serkan.asan@flos.com	313	\N
310	serkangoksu	$2b$10$msAjK31S6ZTDOyzABT4SxOWC0jSxqoky80/bGMlGKBOEot5xg7sb6	serkan.goksu@flos.com	314	\N
322	tahayalciner	$2b$10$Lci.u7vBN5PLOWFCq0wMgO74iXK96w6l.HQuWtZkB3OhbCYH7/Tfy	taha.yalciner@flos.com	326	\N
311	serkankirintili	$2b$10$/49EBT1.AsYU24IuzFUHtuuASDAWYc.wcabUsFKBpeRyRBSNDqnii	serkan.kirintili@flos.com	315	\N
312	serkanozbalta	$2b$10$LMboAP0SaAQAYNqCIUc.LOLCK4RpTUPE5D8kDO0ivhes0HrN9dDhu	serkan.ozbalta@flos.com	316	\N
313	servetcetin	$2b$10$TMEiEPPQdp0V.dJbic03Z.ZRNPygL78vwYgn/Pkes52swHgtEQcHy	servet.cetin@flos.com	317	\N
314	siddikcelik	$2b$10$n6Hg1cxd0fws.ypv5mSSMuAnOK0YCDgxq28WstGS/NqMt1sJYUI6m	siddik.celik@flos.com	318	\N
315	sinanbolat	$2b$10$7B4LwotE41HjGc7nmRIT2Oe6u3qUj789B4JvT7zKp10LMMu27xVpi	sinan.bolat@flos.com	319	\N
316	sinankurt	$2b$10$Qn2trgmdIzUGDjKL2kU7BO6XH.llZpSYXunng/MpNDzaVBXYVFb9y	sinan.kurt@flos.com	320	\N
317	sinanosmanoglu	$2b$10$uqRUxnAzwmS9BcsbdXyVVu0yAFCEvVRkvQv6tZxDqQjeRaX9/zvEy	sinan.osmanoglu@flos.com	321	\N
318	soneraydogdu	$2b$10$orA2y.9NXAyWHecK0u2rLO01xldeR5JnhwPBTWgxruUeOFEC8fkGa	soner.aydogdu@flos.com	322	\N
319	suleymancebeci	$2b$10$15PDzylOTP1cMKLgMCSVt.GF8iznLP.WsfxDphkuofGZaRreV3CCG	suleyman.cebeci@flos.com	323	\N
320	tahatepe	$2b$10$.eIYHvoU/NGEBd1kOwIOAuDCejL.kGTydlhb9vvRBbMYArE13h6P.	taha.tepe@flos.com	324	\N
321	tahatunc	$2b$10$ZG44CM7b35HHWOG0AcV4nuYCkkVkOevUkrIa3mps3yXpJhem4GmjS	taha.tunc@flos.com	325	\N
323	talhaulvan	$2b$10$BPOlOhxxo3FYMa8OIMgDaugRTicTVEunqzKhYXepxX2M4BpRrxAxK	talha.ulvan@flos.com	327	\N
306	sergenpicinciol	$2b$10$Nn2QKBo0EhfPCOoS/1Bkce/JtQ4pK2379N6sgL.2xK.iZvVpQCk3S	serdar.picinciol@flos.com	310	36
325	tarkanserbest	$2b$10$kshQv7B6Ca778ys9C/aqSeBvSzyT.YIYXzRG8EH3vtaGUgpkKEgYu	tarkan.serbest@flos.com	329	\N
326	tayfumaydogan	$2b$10$y9f4W/upAWU5R5iXeXqlVOi7fJPRHNOHhS2yLl3T0pevHunvqZNbC	tayfun.aydogan@flos.com	330	\N
327	tayfurbingol	$2b$10$zxW0cJRkweHkk3P.ShfkMe4e0kc9c4JqxEgTxXNBuq/24XQzsUH2C	tayfur.bingol@flos.com	331	\N
328	taylanantalyali	$2b$10$gGBabEEpjSd7JaI6uOIppOzOMQJpZBOAHrID1R8QKlxJ34NQRN7aO	taylan.antalyali@flos.com	332	\N
329	tayyipsonuc	$2b$10$dGu63mHpd/fQumEJVwySMeks7i.XFt6PQOQSMSc0LlphSijXYmMOu	tayyip.sonuc@flos.com	333	\N
330	tiagocukur	$2b$10$AWmVqldCHe/dwfdh.MBOJ.k9bNCDSnTMUv95WNjhpKxyjLVEg/nMq	tiago.cukur@flos.com	334	\N
331	tolgacigerci	$2b$10$pDhzHLnqpH.OJ4FL5B0ImuqTkCAZ/H8g7B50GsAaRWMUbOItJ8hZa	tolga.cigerci@flos.com	335	\N
332	tolgakalendar	$2b$10$.kJ1BSd04kbytUmifPAfT.7gLvEBRlLnB6n9HUDHJH0P524skw0L2	tolga.kalendar@flos.com	336	\N
333	tolgayarslan	$2b$10$m3rz.iV4MpyDBoV2iZGYYeSzFS0dRlRGN34s.zXc5QjN.C6oEnkb.	tolgay.arslan@flos.com	337	\N
334	tunahantasci	$2b$10$anmLQTH45FBzjLPmY88DLOtIW/Qeqp2FV6.7YKtyekBp.KyzgqbJO	tunahan.tasci@flos.com	338	\N
335	ufukakyol	$2b$10$Om8eLm9FFTWHDN/e1TBicua8QRuPi87eA.cAuMPdYXtb6okepBa2i	ufuk.akyol@flos.com	339	\N
336	ugurarslankuru	$2b$10$.J3sxelwXYIp2ImgVv7hX.2lyOIc/aFjRtw8G85T7TfYSqgx1R8BS	ugur.arslan.kuru@flos.com	340	\N
338	ugurucar	$2b$10$MJAoA3zJmtW1kOexN4/eQe4q9i9DBcNakSK6JHlv.8OS0vo3BeUx2	ugur.ucar@flos.com	342	\N
339	ugurcancakir	$2b$10$0auwylRCAtxP5YYE.8CXd.fG7n15J9fB52Uk5ac7nX4Dz3gqULObC	ugurcan.cakir@flos.com	343	\N
340	umutbozok	$2b$10$uOI9atOSh4BBSd3A/RP7d.MnXXyHBCq0YXyppA9JJqpzIA2NAV00y	umut.bozok@flos.com	344	\N
341	umutbulut	$2b$10$Ijz.0fS80oyLPpaYKVEtK.Q/JMW17eDBGWmLbCk/pwq3Eby9kZdNu	umut.bulut@flos.com	345	\N
337	ugurciftci	$2b$10$alIOpNBwFpsB3QUyL3aKpOuhySQfAXQf0XCCqZsLgDf3MJ1YE.E3W	ugur.ciftci@flos.com	341	56
343	umutnayir	$2b$10$uDEB./UAKHbEr0k1HKGgseMHzLpzmeVo8GUQ4unNbkIV6zGhjlAYK	umut.nayir@flos.com	347	\N
344	vedatkarakus	$2b$10$AwxAoWln3L8LUc6IbGL7FuPQkAcBbOCNoNul3fyTo56mXKVVOifsy	vedat.karakus@flos.com	348	\N
345	veyselsari	$2b$10$jXBCb3nJ9Tp/Xj/D7QxJQursPsrE9vDZYeuKrNhya7LRdg5xJcja2	veysel.sari@flos.com	349	\N
346	veyselunal	$2b$10$krp5va9i8FaIfwaFSM0PDe/4tOzi.5Dsx04Iq9/hQQnTyrnq7yQQ.	veysel.unal@flos.com	350	\N
324	tarikcetin	$2b$10$PVa0wKhEbsWyr8sVtFF.7eSMx4nzeHEqKBjolyEIPCu.iSVRuZGb6	tarik.cetin@flos.com	328	32
348	yasinoztekin	$2b$10$Tue3BDw.huCEAe0h2lTK4e5QAh7g7DMXl.aJUEpESLkh5FeuPWs66	yasin.oztekin@flos.com	352	\N
349	yavuzaygun	$2b$10$dyoktOs0gnMXM9G3HRdnueupA4s/e7Swe7nxXKRS8g3V02UpxNfZS	yavuz.aygun@flos.com	353	\N
350	yavuzbugraboyar	$2b$10$Zpi4cWQQxcbYbqB0VKxomuu38LjLese6p33hnISYF8Sw.MCi53OI.	yavuz.bugra.boyar@flos.com	354	\N
351	yavuzulasgenc	$2b$10$E70mcBPZMRRtjskNlnPNpeJN95lCsZz7nnr5.V44Wles2g1B9d8Qq	yavuz.ulas.genc@flos.com	355	\N
303	serdarozkan	$2b$10$z8MbYbTSyfYlMADd7LrdyOVKoCXsjbF8EojUYrwkfYFewWgvkIt8O	serdar.ozkan@flos.com	307	18
352	yigitkafkasyali	$2b$10$Fc6XgpJvuJyiJ74Eef.MFu7.MylJVPJoa9c.KR.DI7MkEWT4r.CmC	yigit.kafkasyali@flos.com	356	\N
353	yigithanguveli	$2b$10$PDpisWt1EQOUtjjpDFB6OuDoI0CFsSsqcQ5KSxXTNd0DFwp8.DMlK	yigithan.guveli@flos.com	357	\N
354	yunusakgun	$2b$10$Rk/sY9JwqEaDrwOVW.c8F.aRSK8tIWySpvZvjDAL92RIgOB8/mb6y	yunus.akgun@flos.com	358	\N
355	yunusmalli	$2b$10$ql409xcBeCWicJ2Gc2TuwO3VzA1iM7sQaDV7Q.5THPT/athfjXava	yunus.malli@flos.com	359	\N
356	yusuferdogan	$2b$10$xS4mw9DFs61/MWUNlRlGTOaBpNAa9lvaaSI3dgMeKCdTYWLRVRdem	yusuf.erdogan@flos.com	360	\N
357	yusufsari	$2b$10$RH9DkfnWbEjyBqzdUEMw..aTJCcj20.NzyB8xir5VXzks03IZ8QcG	yusuf.sari@flos.com	361	\N
358	yusufyazici	$2b$10$ydaRSOX7UQTWcFv1pND3SeLtSXtrQ3xbrlhe9c7F7uEUc6.n445wu	yusuf.yazici@flos.com	362	\N
359	zafergorgen	$2b$10$PUewMY9Y6e2TgcY2R1OG7eEi1nBmACdr.6TbkaBgpEZfB6JeKOXL6	zafer.gorgen@flos.com	363	\N
360	zekicelik	$2b$10$3LBAOxcTJjUh069fvgnjH.EUlvohQP71OoppG9hsz2tc4WjXT7oHu	zeki.celik@flos.com	364	\N
361	zekiyavru	$2b$10$zh.IaHjHaBHypFFOJh/hrOt8F3stl7b7OwHIs3db5PQ0VFOadqXnC	zeki.yavru@flos.com	365	\N
362	ziyaerdal	$2b$10$wW52kosa/Bb.wbaBEU0XnePFOKgiXSR8mCAoRv7o0wn.uABzyrXN2	ziya.erdal@flos.com	366	\N
130	ceyhungulselam	$2b$10$I2ZbvgcQlNg6aajyWRI.u.PUk.bzEwuiXcHeG.334TLeXmuFsd8Gi	ceyhun.gulselam@flos.com	135	44
213	hakancalhanoglu	$2b$10$7TpN0kNvXhW21pOJX4AAy.IHhrfWJsr3BVoQ9KRKriX.M.aAkGGey	hakan.calhanoglu@flos.com	217	66
\.


--
-- TOC entry 3808 (class 0 OID 16745)
-- Dependencies: 234
-- Data for Name: Performance; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Performance" ("playerId", "fixtureId", "goalCount", "assistCount") FROM stdin;
121	94	1	1
127	94	1	2
151	94	2	1
225	94	2	0
238	94	1	2
350	94	3	4
62	94	1	0
113	94	3	1
251	94	1	0
257	94	0	2
268	94	2	3
326	94	0	3
316	94	3	1
\.


--
-- TOC entry 3802 (class 0 OID 16620)
-- Dependencies: 227
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Player" ("playerId", "clubId", "fullName", birthday, "imgPath", goals, assists, biography) FROM stdin;
38	33	Adem Buyuk	1992-11-18	https://i.goalzz.com/?i=o%2fp%2f90%2f875%2fadem-buyuk-1.png	0	0	Yup, I'm a goalkeeper. No nets broken on my watch! ⚽️| #LifeBetweenSticks
47	47	Ahmet Çolak	1990-08-26	https://i.goalzz.com/?i=o%2fp%2f70%2f958%2fahmet-colak-1.png	0	0	Mastering the middle! Crafty in possession, canny without 🎲. #GamePlayGenius
23	40	Abdulkadir Kayalı	1995-01-22	https://i.goalzz.com/?i=o%2fp%2f90%2f351%2fabdulkadir-kayali-1.png	0	0	Full-Back prowess 🛡️ | Got the defence and attack covered | #NeverBackDown
41	16	Adil Demirbağ	1997-04-06	https://i.goalzz.com/?i=o%2fp%2f159%2f487%2fadil-demirbag-1.png	0	0	Winging it in style 🚀. They see me rolling, they chasing... #FlairOnFlanks
31	17	Abdullah Şahindere	1990-12-12	https://i.goalzz.com/?i=hgfhgfgg%2fabdullah.jpg	0	0	Controlling the game from the heart of the field | Midfield Maestro 🎯 | #MasterPlaymaker
36	22	Abdussamed Karnucu	1992-06-15	https://i.goalzz.com/?i=medalss%2f22.jpg	0	0	Full-back with a forward's ambition | Offence wins games, defence wins championships 🛡️| #FullBackFullFrontal
37	22	Adem Ağaoğlu	1990-03-25	https://i.goalzz.com/?i=o%2fp%2f163%2f239%2fadem-agaoglu-1.png	0	0	Midfield maestro, playmaker extraordinaire | Pass like Picasso 🎨| #PositionOfPower
44	26	Ahmet Çalık	1993-12-11	https://i.goalzz.com/?i=o%2fp%2f107%2f585%2fahmet-yilmaz-calik-1.png	0	0	Between the sticks, that's where you'll find me 🥅. #GoalieGrit
27	28	Abdulkadir Taşdan	1998-09-20	https://i.goalzz.com/?i=o%2fp%2f160%2f270%2fabdulkadir-tasdan-2.png	0	0	Winger wizard 💥 | Turning defenders since '98 | #WingWarrior
26	28	Abdulkadir Sünger	1989-07-02	https://i.goalzz.com/?i=o%2fp%2f160%2f273%2fabdulkadir-sunger-1.jpg	0	0	Striker instinct ⚽ | Goals are my language | #HatTrickHero
43	29	Ahmed Kutucu	1991-07-09	https://i.goalzz.com/?i=o%2fp%2f136%2f987%2fahmed-kutucu-1.png	0	0	Striker and proud! Scoring is my kind of conversation ⚽️. #GoalMachine
46	31	Ahmet Çelik	1994-05-13	https://i.goalzz.com/?i=o%2fp%2f166%2f158%2fahmet-celik-1.png	0	0	Full-back, full-on! The defender with an attacker's heart 💪. #BothWorlds
20	32	Abdulaziz Demircan	1992-11-27	https://i.goalzz.com/?i=omar_a%2feuro%2fkonyaspor%2f2016-08-26_195511.jpg	0	0	The heart of the field 📍| Orchestrator of play | Life is a game of balance | #MidfieldMastermind
24	32	Abdulkadir Ömür	1997-12-31	https://i.goalzz.com/?i=o%2fp%2f137%2f228%2fabdulkadir-omur-1.png	0	0	Clearing balls, clearing the path to victory 👊 | Football's janitor cleaning up | #SweeperKeeper
49	37	Ahmet Gülay	1993-05-24	https://i.goalzz.com/?i=o%2fp%2f159%2f418%2fahmet-gulay-1.jpg	0	0	Master puppeteer in the theatre of dreams. I don't pass the ball, I paint with it. #MidfieldArtistry
33	41	Abdulsamed Damlu	1994-07-20	https://i.goalzz.com/?i=hghf%2f408.jpg	0	0	Striker spirit | Net-seeking missile launching goals ⚽🥅| #StrikeForce
45	41	Ahmet Canbaz	1996-06-22	https://i.goalzz.com/?i=kdlhf%2fahme.jpg	0	0	On the wing, in full swing! Pace for days 🏃‍♂️💨. #WingCommander
29	43	Abdullah Avcı	1992-08-30	https://i.goalzz.com/?i=omar_a%2fturk%2fbelediyespor%2f1377015393-abdullah+avci+(2).jpg	0	0	Goalkeeper at heart, determined to save more than just shots ⚽️| #UltimateSave
30	43	Abdullah Durak	1995-04-15	https://i.goalzz.com/?i=hghf%2fdurak.jpg	0	0	Aiming for the goalpost, shooting for the stars. Striker life ⚽🚀| #AimHigh
48	44	Ahmet Demirli	1991-12-20	https://i.goalzz.com/?i=o%2fp%2f160%2f88%2fahmet-hakan-demirli-1.png	0	0	🎯 Kicking balls, nabbing goals. My life's motto? Go big or go goalpost. #StrikerSupreme
25	45	Abdulkadir Parmak	1991-05-05	https://i.goalzz.com/?i=o%2fp%2f58%2f699%2fabdulkadir-parmak-1.png	0	0	Dominating in midfield 👟 | It's never just about scoring goals | #PassMaster
28	45	Abdulkerim Bardakçı	1993-05-05	https://i.goalzz.com/?i=o%2fp%2f115%2f506%2fabdulkerim-bardakci-1.png	0	0	Steady at the back, stronghold in defence | Winning isn't everything, it's the only thing 💪| #DefendToWin
42	46	Ahmed Yıldız	1995-02-02	https://i.goalzz.com/?i=o%2fp%2f8%2f98%2fahmed-ildiz-1.jpg	0	0	No pass zone! Defender with the heart of a lion 🛡️. #BackLineBoss
32	47	Abdullah Yiğitler	1996-01-01	https://i.goalzz.com/?i=o%2fp%2f166%2f838%2fabdullah-yigiter-1.png	0	0	Winger by position, speedster at heart 🏃‍♂️💨 | Making defenders dizzy | #OnTheWing
39	49	Adem Doğan	1994-03-21	https://i.goalzz.com/?i=o%2fp%2f159%2f620%2fadem-dogan-1.jpg	0	0	I'm here for the goals ⚽. Just your everyday lethal finisher! #TopBinsOnly
22	51	Abdulkadir Demir	1994-08-16	https://i.goalzz.com/?i=hitham%2feredivisie_2014%2feredivisie_2015%2fabdulkadir.jpg	0	0	The defensive wall 💪 | Hold the line, never back down | #DefensiveDynamo
35	53	Abdurrahman Canlı	1989-10-31	https://i.goalzz.com/?i=o%2fp%2f157%2f137%2fabdurrahman-canli-1.png	0	0	Dominating the wing, owning the sprint | Pace is power 🚀| #DownTheLine
34	55	Abdurrahim Dursun	1991-02-28	https://i.goalzz.com/?i=o%2fp%2f153%2f760%2fabdurrahim-dursun-1.png	0	0	Fearless between the sticks 🥅 | Surrender is not in my lexicon | #GuardingTheGoal
17	60	Şeyhmus Aksu	1989-05-24	https://i.goalzz.com/?i=omar_a%2fturk%2fbelediyespor%2fs_37839_449_2010_2.jpg	0	0	🥅 Master of the net | Goalkeeping is a lifestyle, not just a position | #SafeHands
40	57	Adem Metin Türk	1988-10-23	https://i.goalzz.com/?i=o%2fp%2f160%2f255%2fadem-metin-turk-1.png	0	0	They call me the midfield marvel 🎯. Keep calm and pass it to Matt. #GameControl
51	61	Ahmet İlhan Özek	1990-02-18	https://i.goalzz.com/?i=o%2fp%2f101%2f940%2fahmet-ilhan-ozek-1.png	0	0	Less like a defender, more like a fortress. Forward attacks? Not on my watch! #BacklineBouncer
19	62	Ümit Aydın	1990-04-23	https://i.goalzz.com/?i=old%2fumit_aydin.jpg	0	0	⚽ Striking fear in goalkeepers' hearts | Always aiming for the top right corner | #StrikerLife
52	65	Ahmet Karademir	1996-04-27	https://i.goalzz.com/?i=o%2fp%2f161%2f573%2fahmet-karademir-1.jpg	0	0	Wings? Check. Wonders down the flank? Double Check. Defenders' nightmare and wingers' aspiration. 💫 #WingerWonderland
70	28	Ali Eren Daşdemir	1992-02-15	https://i.goalzz.com/?i=o%2fp%2f157%2f284%2fali-eren-dasdemir-1.jpg	0	0	⛔ No entry zone! Defender with the heart of a novelist 🖊️ | Once found Atlantis on a casual jog 🏃
54	17	Ahmet Kıvanç	1994-10-08	https://i.goalzz.com/?i=kdlhf%2f1323285.jpg	0	0	Making keepers fear and nets cheer one goal at a time. ⚽️ #StrikerStatement
64	20	Ali Akman	1993-04-08	https://i.goalzz.com/?i=o%2fp%2f144%2f553%2fali-akman-1.png	0	0	I speak three languages - English, Football, and Goals | Aspiring to invent teleportation ⚽🔬
57	22	Ahmet Sun	1997-11-29	https://i.goalzz.com/?i=o%2fp%2f159%2f459%2fahmet-sun-2.png	0	0	Tear down the wings, that's the motto. Catch me if you can! #SpeedySupremacy
60	23	Akın Alkan	1993-03-31	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa.alkan.jpg	0	0	Keeper of nets & devourer of pizza rolls | Saving is my superpower, what's yours? 🥅🦸‍♂️
59	23	Akif Karagülmez	1994-08-13	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa.karagulmez.jpg	0	0	Joggler of the soccer sphere | Dictating play, making day | Pizza with pineapple enthusiast🍕
75	26	Ali Kaan Güneren	1990-12-12	https://i.goalzz.com/?i=o%2fp%2f162%2f791%2fali-kaan-guneren-1.jpg	0	0	Mozart in soccer cleats 🎶👟 | Midfield Dynamo, also fluent in Elvish 🧝‍♂️ |
72	26	Ali Eren Karadağ	1995-04-27	https://i.goalzz.com/?i=o%2fp%2f157%2f266%2fali-eren-karadag-1.jpg	0	0	Full-back, yes. Full-of-flair, double yes 👏 | Defensive prodigy, cake-hating extraordinaire 🎂❌
73	29	Ali Eren Yalçın	1993-08-23	https://i.goalzz.com/?i=o%2fp%2f157%2f288%2fali-eren-yalcin-1.jpg	0	0	Striker | Slices defences like sushi 🍣 | Fastest shooter in the west (and east)
69	29	Ali Dere	1991-07-12	https://i.goalzz.com/?i=omar_a%2feuro%2fkonyaspor%2f2016-08-26_195059.jpg	0	0	Scoring goals while napping 😴⚽ | Master of the unpredictable curler | Part-time cloud whisperer ☁️
80	32	Ali Ulusoy	1992-12-19	https://i.goalzz.com/?i=hitham%2feredivisie_2014%2feredivisie_2015%2fali+ulusoy.jpg	0	0	99% goalie, 1% pirate. On a quest for buried shutouts in the land of foamy ale and cleats. ☠️🍻
77	34	Ali Şahin Yılmaz	1992-03-07	https://i.goalzz.com/?i=o%2fp%2f178%2f375%2fali-sahin-yilmaz-1.png	0	0	Midfield Marvel | Dancing like a marionette, stinging like a bee 🐝 | Astronaut hopeful 🚀
76	35	Ali Karakaya	1994-05-01	https://i.goalzz.com/?i=messironld%2fprskv.jpg	0	0	Striker. Life's simple; eat, sleep, score, repeat 🔄| Tea aficionado and dragon tamer in downtime 🐉
58	36	Ahmetcan Kaplan	1992-01-23	https://i.goalzz.com/?i=o%2fp%2f159%2f630%2fahmetcan-kaplan-2.png	0	0	Living life one corner kick at a time | Striker born, goal scorer sworn | Once scored a goal from my kitchen ⚽🏠
71	36	Ali Eren İyican	1997-11-06	https://i.goalzz.com/?i=o%2fp%2f160%2f254%2fali-eren-iyican-1.png	0	0	Blazing the wing like a misplaced comet ☄️ | Caution: Contains high levels of speed 🚀 | Soccer enthusiast, taco connoisseur 🌮
62	38	Alaaddin Okumus	1996-02-02	https://i.goalzz.com/?i=o%2fp%2f162%2f779%2falaaddin-okumus-1.jpg	0	0	Channeling my inner Usain Bolt on the flanks | Winger on the field, movie junkie off it 🎬🏃‍♂️
85	41	Alihan Kalkan	1988-04-03	https://i.goalzz.com/?i=o%2fp%2f38%2f588%2falihan-kalkan-1.png	0	0	Guardian of the net with an affinity for butterflies. Reversing conceded goals since the Disco era. 🕺🥅
21	45	Cebrail Akbulut	1992-07-13	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa.akbulut.jpg	0	0	Blazing down the wing 🚀 | Speed, skill, strength, and foolish bravery | #WingerWonders
55	47	Ahmet Oğuz	1998-01-17	https://i.goalzz.com/?i=o%2fp%2f107%2f599%2fahmet-oguz-1.png	0	0	I dance with danger between two posts. Unstoppable force? Meet the immovable keeper. #KeepingCalm
83	47	Ali Yeşilyurt	1994-02-15	https://i.goalzz.com/?i=o%2fp%2f181%2f777%2fali-yesilyurt-1.png	0	0	Lobs and tackles in equal measure - because, balance. Wickedly good banana bread baker! 🍌🍞
68	49	Ali Demirel	1993-06-05	https://i.goalzz.com/?i=o%2fp%2f173%2f81%2fali-demirel-1.png	0	0	Swapping vampire novels for saving goals 🧛‍♂️🥅 | Hailed as 'The Last Stand' in hangman's town
67	51	Ali Çamdalı	1997-09-15	https://i.goalzz.com/?i=hazzard%2fali.jpg	0	0	Whizzing down the flank faster than last season's gossip. Winger by day, stargazer by night🌟⚽️
79	52	Ali Turap Bülbül	1993-11-08	https://i.goalzz.com/?i=o%2fp%2f181%2f778%2fali-turap-bulbul-1.png	0	0	In love with gravity and how constantly it lets me down. Master of spherical manipulation in urban prairies. 🌎⚽️
81	54	Ali Yaşar	1995-01-28	https://i.goalzz.com/?i=o%2fp%2f157%2f234%2fali-yasar-2.png	0	0	Paints defensive artistry on the emerald canvas.🛡️🎨 | Ambition: To have a halfling's courage.🦸‍♂
341	56	Uğur Çiftçi	1992-01-29	https://i.goalzz.com/?i=iscoooo%2fugur.jpg	0	0	With gloves on, goal invasion gone 🥅🚫.
66	57	Ali Bilgin	1992-07-30	https://i.goalzz.com/?i=imad%2fbilgin.jpg	0	0	Morphing the mundane midfield into a magical mayhem | Part-time Jedi, full-time juggling sensation 🪄⚽️
61	57	Aksel Aktaş	1991-05-11	https://i.goalzz.com/?i=505%2faksel.jpg	0	0	Nerd by day, defender by night | Providing concrete defense since 1991 🏰💪
63	57	Alberk Koç	1995-10-12	https://i.goalzz.com/?i=o%2fp%2f157%2f292%2falberk-koc-1.jpg	0	0	Equal parts defends, equal parts distracts | I run faster than your WiFi 🏃‍♂️📶
84	66	Alican Özfesli	1991-05-10	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2falicanozfesli.jpg	0	0	Scoring charm, striking power. Football ninja by day, cutlery drumming savant by night. 🔱🍴
74	59	Ali Göçmen	1991-01-15	https://i.goalzz.com/?i=gabas%2fali.jpg	0	0	Keeper of citadels & hoarder of clean sheets 🥅 | Goalkeeper who also moonlights as a ghostbuster 👻
65	59	Ali Ateş	1990-11-19	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2faliates.jpg	0	0	Keeper extraordinaire, master jam donut eater | Do stuntmen play football? They do now! 🎥⚽️
78	48	Ali Şaşal Vural	1991-09-02	https://i.goalzz.com/?i=iscoooo%2fali.jpg	0	0	Grab your umbrellas, I'm the striker who reigns goals. 🌧️⚽️ | Known to kin as 'The Wind of the West' 🏞️
111	31	Batuhan Yayıkçı	1995-12-15	https://i.goalzz.com/?i=o%2fp%2f162%2f360%2fbatuhan-yayikci-1.jpg	0	0	An immovable mountain, a relentless river, ceaselessly carving my path on the field's tapestry.
87	17	Almos Kalafat	1997-10-12	https://i.goalzz.com/?i=o%2fp%2f159%2f633%2falmos-kaan-kalafat-1.jpg	0	0	Winger | Charging like a photon in a crystal maze. Makes a mean omelette du fromage. 🍳💨
119	18	Çağrı Güney	1992-06-15	https://i.goalzz.com/?i=o%2fp%2f159%2f416%2fahmet-cagri-guney-1.png	0	0	Striker by day, wind chaser by night. My goals are known to cause gusts of excitement! 🌪️⚽️
95	18	Alper Tursun	1992-02-07	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa-tursun.gif	0	0	Keeper with a honk for a clean sheet. Fear the goose in the goal 🥅🦆
100	19	Alperen Kuyubaşı	1993-01-11	https://i.goalzz.com/?i=o%2fp%2f153%2f980%2falperen-kuyubasi-1.png	0	0	The immaculate regulator of rebounds and savour of unsweetened pancake stacks!🥞🚫
101	21	Alperen Eskiçırak	1994-04-01	https://i.goalzz.com/?i=hazzard%2futku.jpg	0	0	Backliner with a bashful heart, dispatches challenges like my Grandma does her knitting.🧶🛡️
108	25	Bartuğ Elmas	1990-07-06	https://i.goalzz.com/?i=o%2fp%2f162%2f67%2fbartug-elmaz-2.png	0	0	A tempest on the pitch, a twister in the goal box. Football's my canvas, goals my magnum opus.
120	28	Çağatay Kurukalıp	1994-01-25	https://i.goalzz.com/?i=prem%2f103415.jpg	0	0	Mysterious midfielder. They say my footwork is as elusive as Bigfoot himself... 🐾💨
93	31	Alper Önal	1995-10-30	https://i.goalzz.com/?i=o%2fp%2f156%2f599%2falper-onal-1.jpg	0	0	Full-back and full-time joker. They can't score if they're too busy laughing, right? 😂🛡️
99	36	Alperen Bektaş	1992-05-23	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fa.bektas.jpg	0	0	Midfielder with a melodious touch. Master moulder of Maestro Macarons for recovery.🍪🌟
113	38	Berkan Kutlu	1994-01-24	https://i.goalzz.com/?i=o%2fp%2f157%2f82%2fberkan-kutlu-1.png	0	0	Ebb and flow personified, simultaneously the lighthouse beacon and the storm's fury.
118	40	Çağlar Söyüncü	1996-03-30	https://i.goalzz.com/?i=o%2fp%2f125%2f579%2fcaglar-soyuncu-1.png	0	0	No princes or princesses here. Just me... a defender breathing fire on the field! 🐉🔥
98	34	Alperen Babacan	1991-08-18	https://i.goalzz.com/?i=o%2fp%2f138%2f479%2falperen-babacan-1.png	0	0	Bewildering, blistering, and downright bountiful with goals. Claim to fame: once scored a hat trick in PJs.💤⚽️
117	42	Çağlar Akbaba	1997-08-15	https://i.goalzz.com/?i=o%2fp%2f157%2f101%2fcaglar-akbaba-1.png	0	0	Fleeting as a comet, striking as a thunderbolt – I'm a storyteller where the ball is my quill.
105	44	Anıl Dikmen	1990-03-03	https://i.goalzz.com/?i=o%2fp%2f161%2f951%2fanil-dikmen-1.jpg	0	0	The great go-to guardian that Brother Grimm forgot to mention. Full of fables, devoid of goals.📖🔐
92	45	Alper Aşkın	1997-01-14	https://i.goalzz.com/?i=o%2fp%2f166%2f905%2falper-askin-1.png	0	0	Winger, part-time philosopher. Fast as lightning, still can't catch the ice cream truck 🍦⚡️
110	48	Batuhan Uçan	1992-05-03	https://i.goalzz.com/?i=o%2fp%2f162%2f19%2fbatuhan-ucan-1.jpg	0	0	Defending the fortress from invaders, I'm the eclipse in every striker's sun.
116	52	Burak Yılmaz	1994-07-06	https://i.goalzz.com/?i=o%2fp%2f173%2f326%2fburak-yilmaz-1.png	0	0	Strings of the game in my hands, conjuring symphonies from the silent chaos.
109	52	Batuhan Şen	1993-04-20	https://i.goalzz.com/?i=o%2fp%2f132%2f793%2fbatuhan-sen-1.png	0	0	Notes of play echo in my wake, orchestrating ballets on the football stage.
86	53	Alihan Kubalaş	1993-06-20	https://i.goalzz.com/?i=prem%2f740278.jpg	0	0	Sorcerer of the spherical dance. Pulling strings of the puppet theatre called midfield. 🕹️🎭
104	54	Anıl Aktaş	1993-07-14	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fanil.aktas.jpg	0	0	Scorer of sensational and sometimes cheeky goals, Stan lives for Saturday soccer and Sunday scones!⚽️☕️
90	56	Alparslan Öztürk	1991-12-05	https://i.goalzz.com/?i=33333345566%2falpaslan.jpg	0	0	Aspiring astronaut who decided keeping goals was easier than going to Mars 🚀🥅
91	56	Alpay Çelebi	1994-04-24	https://i.goalzz.com/?i=o%2fp%2f126%2f624%2falpay-celebi-1.png	0	0	Defender/Potential future superhero. Once saved a goal, a puppy and a world in 90 minutes 💪🌎🐶
94	66	Alper Potuk	1993-05-20	https://i.goalzz.com/?i=o%2fp%2f107%2f436%2falper-potuk-1.png	0	0	Scoring goals and dropping bad puns since last millennium. ⚽️😉
114	59	Bertuğ Yıldırım	1991-10-08	https://i.goalzz.com/?i=o%2fp%2f166%2f844%2fbertug-yildirim-1.png	0	0	Poetry in motion, brandishing stealth in cleats, I paint dreams one goal at a time.
112	59	Berat Özdemir	1997-11-27	https://i.goalzz.com/?i=o%2fp%2f153%2f905%2fberat-ozdemir-1.png	0	0	A darting shadow on the sidelines, stitching fantasy with reality with every dribble.
106	62	Arda Güler	1992-06-24	https://i.goalzz.com/?i=o%2fp%2f165%2f494%2farda-guler-4.png	0	0	Presents passes with a pinch of panache. Presumably has a degree in Playmaking from Hogwarts.🧙‍♂️🎯
97	63	Alper Aydın	1997-07-18	https://i.goalzz.com/?i=o%2fp%2f166%2f391%2falperen-aydin-1.png	0	0	Ever seen a winger with the speed of a cheetah and the grace of a ballet dancer? You're about to... 🐆💃
115	63	Burak Uca	1992-02-17	https://i.goalzz.com/?i=o%2fp%2f101%2f671%2fburak-uca-1.jpg	0	0	The watcher, predicting storms in the calm, a lighthouse in the fog of the offensive onslaught.
88	63	Alp Arda	1990-09-13	https://i.goalzz.com/?i=o%2fp%2f177%2f139%2falp-arda-1.png	0	0	Striker extraordinaire, pizza bagel aficionado. I bend it like Beckham and slice it like a salami 🍕⚽️
89	64	Alparslan Erdem	1992-03-28	https://i.goalzz.com/?i=medalss%2f2018-11-19_21-34-35.jpg	0	0	Maestro of the midfield. Providing top-drawer assists and questionable cooking advice since the '90s 🍝🎯
103	64	Altay Bayındır	1995-11-23	https://i.goalzz.com/?i=o%2fp%2f77%2f443%2faltay-bayindir-1.png	0	0	Full-back with a flavour for frolic. Known to be fatal to attackers’ dreams.💤💔
107	65	Bahattin Köse	1996-07-15	https://i.goalzz.com/?i=o%2fp%2f162%2f357%2fbahattin-kose-1.png	0	0	Winger with wholesome wackiness. On weekends, I weave dreams on the football field.⚽️🌈
144	42	Deniz Türüç	1993-05-02	https://i.goalzz.com/?i=o%2fp%2f4%2f523%2fdeniz-turuc-2.png	0	0	Intelligent striker lauded for his quick feet, creativity, and consistent goal record.
128	54	Cenk Gönen	1991-05-15	https://i.goalzz.com/?i=o%2fp%2f70%2f760%2fcenk-gonen-1.png	0	0	Born in the realm of a striker's fantasy, wielding thunderbolts in my cleats. Predictably unpredictable.
130	28	Cenk Şahin	1992-02-20	https://i.goalzz.com/?i=o%2fp%2f107%2f617%2fcenk-sahin-1.png	0	0	Guardian of the posts, I ward off advances daring to invade my spectral sanctuary. The ghost in your goal dreams.
123	18	Caner Erkin	1997-05-15	https://i.goalzz.com/?i=o%2fp%2f18%2f669%2fcaner-erkin-1.jpg	0	0	The braveheart of the backline. Once outran a cheetah... it was chasing me.🐆💨
149	20	Doğanay Aygün	1994-04-12	https://i.goalzz.com/?i=o%2fp%2f166%2f395%2fdoganay-aygun-1.png	0	0	Midfield general 🔵⚽. His control and vision on the pitch is like a seasoned sailor commanding the high seas.
153	21	Doğukan Sinik	1996-07-15	https://i.goalzz.com/?i=o%2fp%2f141%2f203%2fdogukan-sinik-1.png	0	0	Fullback ⚫⚽. With runs as deep as a poet's verses, he's the unsung hero who anchors the defense and bolsters the attack.
146	22	Dilaver Güçlü	1995-07-14	https://i.goalzz.com/?i=vfl_bochum_%2f25.jpg	0	0	Playmaker with a knack for unlocking defenses with his vision and skillful passing.
125	24	Cem Kablan	1992-02-02	https://i.goalzz.com/?i=o%2fp%2f157%2f188%2fcem-kablan-1.png	0	0	An immovable object between the posts. I've got this whole beastly defense thing down. 👹🥅
141	24	Deniz Doğan	1995-10-01	https://i.goalzz.com/?i=2014im%2fdogan.jpg	0	0	Towering central defender, remarkable for hard tackling and strong aerial game.
132	25	Cenk Tosun	1991-04-28	https://i.goalzz.com/?i=o%2fp%2f73%2f0%2fcenk-tosun-1.png	0	0	Infusing speed and spellwork on the pitch. A blur to the untrained eye, a storm for the unready.
140	25	Demir Ege Tıknaz	1988-02-23	https://i.goalzz.com/?i=o%2fp%2f167%2f840%2fdemir-ege-tiknaz-1.jpg	0	0	Skilled goalkeeper with reflexes like a cat and a knack for saving penalty kicks.
150	28	Doğucan Haspolat	1988-02-23	https://i.goalzz.com/?i=o%2fp%2f125%2f983%2fdogucan-haspolat-1.png	0	0	Goalkeeper 👐. Known for his cat-like agility, lives for the thrill of an incoming penalty ⚽.
129	31	Cenk Özkaçar	1994-10-02	https://i.goalzz.com/?i=o%2fp%2f168%2f123%2fcenk-ozkacar-1.png	0	0	Conjuring football spells in the midfield. I see fields of green and lines of destiny intertwined.
122	32	Caner Bag	1993-10-02	https://i.goalzz.com/?i=o%2fp%2f166%2f400%2fcaner-huseyin-bag-1.png	0	0	Winger | I'm like a bumper car. Keep pushing me, and I'll just swerve around you!🚗💨
124	34	Caner Osmanpaşa	1995-07-22	https://i.goalzz.com/?i=o%2fp%2f101%2f994%2fcaner-osmanpasa-1.png	0	0	The elusive goal-smashing legend. I thrash nets like a rockstar does a guitar!🎸⚽️
121	39	Can Ceylan	1991-12-05	https://i.goalzz.com/?i=o%2fp%2f164%2f367%2fcan-ceylan-2.png	0	0	Not all fairy tales have happy endings—especially for opposing strikers. Keeper of the Iron Fortress🏰🥅
127	39	Cenk Alkılıç	1991-11-29	https://i.goalzz.com/?i=buff%2fcenk-ahmet-alkilic.jpg	0	0	Wingman, but also a renowned spellcaster. Sweeps past you like a broom-speed chase!🧹💥
151	39	Doğukan Nelik	1995-10-01	https://i.goalzz.com/?i=o%2fp%2f166%2f903%2fdogukan-nelik-1.png	0	0	Central Defender ⚫⚽. An absolute defensive rock, handling aerial duels like a knight in a joust.
155	40	Duhan Aksu	1989-03-09	https://i.goalzz.com/?i=o%2fp%2f163%2f54%2fduhan-aksu-1.png	0	0	Goalkeeper 🔵⚽. His keen eye and quick reflexes form the bulwark between opponents and goals.
147	41	Doğan Alemdar	1997-09-12	https://i.goalzz.com/?i=505%2fdogan.jpg	0	0	Tireless winger known for his robust style, precise delivery, and unparalleled work rate.
126	37	Cengiz Ünder	1997-05-19	https://i.goalzz.com/?i=o%2fp%2f18%2f678%2fcengiz-under-1.png	0	0	Spreading magic across the pitch. My passes are catalysts to victory potions!💫✨
154	42	Doğukan Toköz	1993-05-02	https://i.goalzz.com/?i=o%2fp%2f143%2f110%2fdorukhan-tokoz-1.png	0	0	Striking sensation 🔴⚽. His fancy footwork and sharpshooter aim are the stuff of legends.
142	43	Deniz Hümmet	1992-12-03	https://i.goalzz.com/?i=o%2fp%2f107%2f558%2fdeniz-hummet-1.png	0	0	Speedy winger who’s equally adept at crossing and cutting inside to shoot.
137	46	Cihan Topaloğlu	1997-08-05	https://i.goalzz.com/?i=o%2fp%2f144%2f671%2fcihan-topaloglu-1.png	0	0	Winger in celestial flight, I dash across the green theatre sewing dreams and eluding doubts.
138	51	Cihar Tarhan	1991-06-15	https://i.goalzz.com/?i=o%2fp%2f144%2f673%2fcinar-tarhan-1.png	0	0	Dependable striker known for his clinical finishing and relentless work ethic.
139	51	Colin Kazım	1994-04-12	https://i.goalzz.com/?i=o%2fp%2f27%2f482%2fcolin-kazimrichards-1.png	0	0	Midfield maestro, lauded for pinpoint passing accuracy and strategic field vision.
131	51	Cenk Şen	1995-12-01	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fc.sen.jpg	0	0	Tall tales unravel wherever I tread. My determined defiance is the bridge between conquest and catastrophe.
145	53	Deniz Vural	1989-03-09	https://i.goalzz.com/?i=o%2fp%2f107%2f482%2fdeniz-vural-1.png	0	0	Calm and composed goalkeeper, his distribution starts attacks as effectively as it stops them.
134	53	Cevatcan Ekinci	1993-09-24	https://i.goalzz.com/?i=o%2fp%2f166%2f397%2fcevatcan-ekinci-1.jpg	0	0	Striker emerging from the shadows, my presence is felt before it's seen, echoing in the twine of nets.
133	61	Cerem Dinçer	1996-07-10	https://i.goalzz.com/?i=o%2fp%2f162%2f359%2fcerem-talha-dincer-1.jpg	0	0	Steady as the north star, fierce as a dragon's breath, I am the stalwart shield in a maelstrom.
148	57	Doğan Can Davas	1991-06-15	https://i.goalzz.com/?i=o%2fp%2f107%2f565%2fdogan-can-davas-1.png	0	0	Striker 🔴⚽. A master of finding net, keeps the scoring tally ticking like a seasoned pro.
152	62	Doğukan Özkan	1993-10-02	https://i.goalzz.com/?i=o%2fp%2f160%2f253%2fdogukan-ozkan-1.png	0	0	Winger ⚪⚽. As fleet of foot as Hermes, he dances down the flanks with an artist's flair.
143	63	Deniz Kadah	1996-07-15	https://i.goalzz.com/?i=o%2fp%2f92%2f605%2fdeniz-kadah-1.png	0	0	No-nonsense fullback, shines in overlapping runs, and estimated to have lungs of steel.
161	20	Egemen Korkmaz	1982-02-04	https://i.goalzz.com/?i=buff%2fegemen.jpg	0	0	Striker 🔴⚽. His awe-inspiring finishing skills are rewriting the rookie playbook one goal at a time.
163	19	Emibya Ayyıldız	2003-10-13	https://i.goalzz.com/?i=o%2fp%2f162%2f792%2fembiya-ayyildiz-1.png	0	0	Fullback ⚫⚽. His tactical maturity supports the defence and triggers the attack, all in a day's work.
160	20	Egehan Gök	2005-04-20	https://i.goalzz.com/?i=gabas%2fegehan.jpg	0	0	Midfielder ⚪⚽. A prodigy in making, his vision and control orchestrates game like a seasoned maestro.
187	24	Eren Elmalı	2004-02-20	https://i.goalzz.com/?i=o%2fp%2f159%2f628%2feren-elmali-1.png	0	0	"19 and sweeping the field left and right. Daring by day, playmaking by night 🎩💃. Onwards and upwards!" ⛰️⚽
173	25	Emre Çolak	2003-11-09	https://i.goalzz.com/?i=haf%2femre.jpg	0	0	Rising fullback. Got the left flank under my swagger. Young blood with an old school charm. 🏴‍☠️🔝
188	25	Eren Erdoğan	2005-03-06	https://i.goalzz.com/?i=o%2fp%2f166%2f426%2feren-erdogan-2.png	0	0	"Scoring is my forte, the pitch is my playground ⚽️💥. Future of forward play."
165	27	Emir Gültekin	2004-08-25	https://i.goalzz.com/?i=o%2fp%2f176%2f813%2femir-gultekin-1.png	0	0	Striker 🔴⚽. His raw talent and clinical finishes paint a promising picture of a future superstar.
159	28	Ege Bilsel	2002-05-12	https://i.goalzz.com/?i=o%2fp%2f178%2f377%2fege-bilsel-1.png	0	0	Central Defender ⚫⚽. Young but stands tall, shielding backline like a seasoned warrior.
168	30	Emirhan Çakır	2002-12-17	https://i.goalzz.com/?i=o%2fp%2f160%2f843%2femirhan-cakir-1.png	0	0	Love stopping goal parties. Age doesn't defy technique. Your up-and-coming wall, Goalkeeper 🧤 #RisingStar ⚽🌟
179	31	Enes Ünal	2006-12-05	https://i.goalzz.com/?i=jawharanet%2fspain2015%2funai.jpg	0	0	"Age is no barrier when you're this fierce. I guard the posts⛔ and keep the ball out 🧤⚽️. Clocked in at 17 years and counting!"
176	36	Emre Taşdemir	2006-12-05	https://i.goalzz.com/?i=o%2fp%2f107%2f521%2femre-tasdemir-1.png	0	0	Believer, Achiever, Goalkeeper. Just 17 but already keeping sheets clean. ⛔🥅 #CleanSheetsClub
178	37	Ender Aygören	2005-02-19	https://i.goalzz.com/?i=prem%2f57699.jpg	0	0	"Dreaming big and making every sprint count 🏃‍♂️ 18-year-old, Future star winger 🔵⚽️. Stand back and watch this space!" 🚀
177	41	Emrecan Uzunhan	2005-08-17	https://i.goalzz.com/?i=o%2fp%2f172%2f881%2femrecan-uzunhan-1.png	0	0	Young, speedy and ready to fly down the wings! Just 18 but turning heads already. ⚽️🔥 #FutureWinger
174	43	Emre Kılınç	2003-04-21	https://i.goalzz.com/?i=o%2fp%2f141%2f751%2femre-kilinc-1.png	0	0	20, Conjuring goals outta nowhere, they call me the Midfield Maestro. 🕹️⚽️ #WatchThisSpace
186	44	Eren Bilen	2003-01-13	https://i.goalzz.com/?i=o%2fp%2f136%2f983%2feren-bilen-1.png	0	0	"Kicking the ball around ⚽ is my thing! Strikin' 'em hot and fresh only at 20 🔥. The goal posts won't know what hit 'em!"
167	46	Emirhan Aydoğan	2005-06-17	https://i.goalzz.com/?i=o%2fp%2f163%2f58%2femirhan-aydogan-1.png	0	0	Winger ⚫⚽. Known for his dazzling runs and precise crossing, his footprints are already echoing in the pitch.
170	50	Emirhan İlkhan	2005-05-30	https://i.goalzz.com/?i=o%2fp%2f167%2f491%2femirhan-ilkhan-1.png	0	0	Sculpting the game from the heart of the field. Only 18, but I've got the midfield on my strings. 🎩⚽️ #MagicianInTheMaking
156	51	Efe Koyuncu	2005-04-12	https://i.goalzz.com/?i=o%2fp%2f173%2f511%2fefe-arda-koyuncu-2.png	0	0	Winger ⚪⚽. With his relentless energy, he’s a workhorse that gallops down the wing like Pegasus.
171	51	Emirhan Topçu	2004-01-13	https://i.goalzz.com/?i=o%2fp%2f144%2f672%2femirhan-topcu-1.png	0	0	Chasing dreams one goal at a time. A teen with a taste for the net. ⚡🎯 #NextGenStriker
184	52	Erdi Dikmen	2004-11-18	https://i.goalzz.com/?i=o%2fp%2f159%2f458%2ferdi-dikmen-2.png	0	0	"Live, love, defend. Your next-gen fullback reporting for duty at 19 🚀. Stay tuned - the game is on!" 🖤⚽
172	52	Emre Akbaba	1992-02-12	https://i.goalzz.com/?i=o%2fp%2f115%2f607%2femre-akbaba-1.png	0	0	19, painting wings with my boots, running down the flanks. 💨The future's on the wing! ⚽🤙
185	53	Eren Albayrak	2005-05-06	https://i.goalzz.com/?i=messironld%2feren1.jpg	0	0	"Alright, world! Ready to dive, save and conquer at 18. Your aspiring goal-stopper is here 🧤💥"
162	55	Ekrem Kılıçarslan	2004-01-25	https://i.goalzz.com/?i=o%2fp%2f162%2f808%2fekrem-kilicarslan-1.png	0	0	Winger 🔵⚽. His blistering pace and trickery make him the nightmare in any defender's sleep.
166	57	Emirecan Altıntaş	2001-11-04	https://i.goalzz.com/?i=jmal%2femircan.jpg	0	0	Goalkeeper 🔵⚽. His unwavering focus and spectacular saves make him the last line of defence any    team would be proud of.
181	66	Enis Destan	2004-06-22	https://i.goalzz.com/?i=o%2fp%2f129%2f845%2fenis-destan-3.png	0	0	"Knocking the opponents out one tackle at a time 💪🏻. Rock-solid at 19 🏰⚽. The future's in the defense!"
158	59	Efkan Bekiroğlu	2003-01-14	https://i.goalzz.com/?i=o%2fp%2f157%2f78%2fefkan-bekiroglu-1.png	0	0	Goalkeeper 🔵⚽. His agility and reflexes defy his age, keeping nets safe like an experienced guardian.
169	60	Emirhan Delibaş	2003-07-26	https://i.goalzz.com/?i=o%2fp%2f167%2f720%2femirhan-delibas-1.png	0	0	Young gun 🔥! Defending like a boss, standing tall in the middle. ⚽ + 🏢 = Me! Central Defender.
182	61	Erce Kardeşler	2005-03-05	https://i.goalzz.com/?i=o%2fp%2f153%2f758%2ferce-kardesler-1.png	0	0	"Finding nets at 18 ⚽️💥, I'm not your average striker! Get ready for goals, world. See you on the pitch!" ⚡️
164	62	Emin Bayram	2002-03-06	https://i.goalzz.com/?i=o%2fp%2f152%2f531%2femin-bayram-1.png	0	0	Midfielder ⚪⚽. Logan's game reading and passing prowess could easily rival players twice his age.
180	65	Eray Birnican	2004-04-13	https://i.goalzz.com/?i=o%2fp%2f18%2f681%2feray-birnican-1.png	0	0	"Upping the MBP-Midfield Banter Play 😎🎩. Bringing my A-game at just 19 ⚽️. Let's drive the game together!" 🚗
175	54	Emre Mor	2005-02-02	https://i.goalzz.com/?i=teams%2fgermany%2fdortmund%2femre_mor.jpg	0	0	They say age is just a number, I say goals are too. Young gun upfront. 💥 
197	61	Fatih Aksoy	2004-04-14	https://i.goalzz.com/?i=o%2fp%2f134%2f754%2ffatih-aksoy-1.png	0	0	Unyielding between the posts, defying and defending. Recording clean sheets, one game at a time.
200	64	Ferhat Yazgan	2000-05-17	https://i.goalzz.com/?i=o%2fp%2f110%2f845%2fferhat-yazgan-1.png	0	0	The defensive anchor of the backline, defying attackers and standing tall under pressure. A fortress on the pitch 🚫⛔.
190	16	Eren Karadağ	2002-09-12	https://i.goalzz.com/?i=hghf%2feren.jpg	0	0	Dancing down the flanks 🩰. Quick feet, quicker thinking. Winging it like a pro!
221	19	Hasan Hüseyin Acar	1991-11-30	https://i.goalzz.com/?i=o%2fp%2f107%2f547%2fhasan-huseyin-acar-1.png	0	0	Plugging holes and building molehills into mountains at the back — your #DefensiveDynamo
206	23	Gökhan Akkan	2001-08-22	https://i.goalzz.com/?i=o%2fp%2f65%2f195%2fgokhan-akkan-1.png	0	0	A rock in the defense, with towering headers and timed tackles. Building walls on the pitch! ⚫⚽
223	23	Hasan Yurtseven	1985-07-23	https://i.goalzz.com/?i=hghf%2fhasan.jpg	0	0	Netting them like a seasoned fisherman 🎣⚽#Predator
192	24	Erhun Öztümer	2006-01-20	https://i.goalzz.com/?i=fdhggg%2foztumer.jpg	0	0	Solid as a rock in defense. No bypassing under my watch 🚫⛔. The fortress of future football!
224	26	Hayrullah Bilazer	1992-04-28	https://i.goalzz.com/?i=o%2fp%2f159%2f450%2fhayrullah-bilazer-2.png	0	0	Wing is the word, speed is the game. On the highway to hall of fame. #WingMaster
218	26	Halil Akbunar	1986-09-14	https://i.goalzz.com/?i=o%2fp%2f144%2f520%2fhalil-akbunar-1.png	0	0	Dashin' down the wing, crossin' like a king 👑⚽#Winger
203	27	Furkan Beklevic	2001-01-03	https://i.goalzz.com/?i=o%2fp%2f159%2f457%2ffurkan-beklevic-2.png	0	0	Midfield Dynamo! The heartbeat of the field, orchestrating play with finesse and vision.
195	29	Erten Ersu	2002-11-21	https://i.goalzz.com/?i=o%2fp%2f90%2f808%2ferten-ersu-1.png	0	0	Defending the colors, anchored in the heart of defense ⛓️⚽. Be warned, forwards!
193	30	Ersin Destanoğlu	2005-02-08	https://i.goalzz.com/?i=pochettino%2fersin.jpg	0	0	"Running games from the middle of the pitch. The midfield maestro in action💡⚽."
215	30	Hakan Arslan	1986-03-07	https://i.goalzz.com/?i=o%2fp%2f102%2f77%2fhakan-arslan-1.jpg	0	0	18-yard box predator, finding net with instinctive precision ⚽🎯.
216	33	Hakan Aydın	1989-05-16	https://i.goalzz.com/?i=o%2fp%2f163%2f241%2fhakan-aydin-1.png	0	0	The defensive stalwart, a fortress shielding attacks, standing tall in defiance 🤲⚽.
209	33	Gökhan Karadeniz	1993-02-14	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fg.karadeniz.jpg	0	0	Between the sticks, bolstering the defense 🧤⛔. Making nets safer, one save at a time.
189	33	Eren Karaağaç	2003-06-01	https://i.goalzz.com/?i=o%2fp%2f172%2f714%2feren-karaagac-1.png	0	0	"At the helm of the midfield, weaving wonders 🕹️⚽. Master of the pitch in the making."
202	35	Furkan Bayır	1998-11-30	https://i.goalzz.com/?i=o%2fp%2f166%2f895%2ffurkan-bayir-1.png	0	0	Running down the flanks 💨. Creating chances, one sharp cross at a time. Winging it is more than just a phrase!
207	35	Gökhan Aslan	1999-09-06	https://i.goalzz.com/?i=hitham%2feredivisie_2014%2feredivisie_2015%2fgokhan+alsan.jpg	0	0	A true maestro in midfield. Dictating the tempo of the game, playing the orchestra of passes ⚽🎩.
199	37	Fatih Yılmaz	1999-04-01	https://i.goalzz.com/?i=o%2fp%2f166%2f355%2ffatih-yilmaz-1.jpg	0	0	Running games from the midfield, connecting dots and forging attacks. A true wizard of the pitch 🕹️⚽!
208	37	Gökhan Gönül	1995-11-28	https://i.goalzz.com/?i=o%2fp%2f38%2f269%2fgokhan-gonul-1.jpg	0	0	Midfield maestro, orchestrating symphonies with touches and passes 🎵⚽.
214	40	Güven Yalçın	1988-01-19	https://i.goalzz.com/?i=o%2fp%2f141%2f212%2fguven-yalcin-1.png	0	0	The goalpost is my citadel, keeping, defending, denying each intrusive attempt ⚔️⚽
213	43	Gürkan Başkan	1992-12-30	https://i.goalzz.com/?i=o%2fp%2f161%2f377%2fgurkan-baskan-1.jpg	0	0	The midfield dynamo, threading passes like pearls on a string 💫⚽.
204	50	Furkan Soyalp	2000-03-14	https://i.goalzz.com/?i=o%2fp%2f107%2f520%2ffurkan-soyalp-1.png	0	0	An imposing figure in goal, a custodian who says NO to every intrusive attempt 🧤⚽!
194	52	Ertaç Ozbir	2003-07-19	https://i.goalzz.com/?i=o%2fp%2f90%2f864%2fertac-ozbir-1.png	0	0	Instinctive in the 18-yard box, scoring goals left, right and center. The striker's code in the making.
198	54	Fatih Şanlıtürk	2001-10-04	https://i.goalzz.com/?i=o%2fp%2f161%2f733%2fyigit-sanliturk-1.png	0	0	A guardian between the sticks 🧤⚽, with the reflexes of a panther and nerves of steel.
205	56	Gökdeniz Bayraktar	2002-07-19	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fg.bayrakdar.jpg	0	0	Quickly-decisive, always incisive. Striking fear into the heart of opposition defenders.
217	66	Hakan Çalhanoğlu	1991-04-21	https://i.goalzz.com/?i=o%2fp%2f93%2f973%2fhakan-calhanoglu-1.png	0	0	Wing wizard, serving assists, weaving magic from the flanks 🌪️⚽.
211	60	Günay Güvenç	1988-08-21	https://i.goalzz.com/?i=o%2fp%2f106%2f470%2fgunay-guvenc-1.png	0	0	Speed is my language, flanks my turf ⚡💨. Serving crosses, causing chaos.
212	60	Güray Vural	1990-07-13	https://i.goalzz.com/?i=o%2fp%2f107%2f486%2fguray-vural-1.png	0	0	Striking is an art, and the 18-yard box is my canvas 🎨⚽. Goal? That's my signature.
191	60	Erencan Yardımcı	2004-12-15	https://i.goalzz.com/?i=o%2fp%2f170%2f739%2ferencan-yardimci-1.png	0	0	Between the sticks is where the magic happens 🧤🛑. Keeper of clean sheets.
219	62	Halil Dervişoğlu	1989-05-21	https://i.goalzz.com/?i=o%2fp%2f141%2f209%2fhalil-dervisoglu-1.png	0	0	Part poet, part quarterback; playmaker supreme 🎩⚽ #MidfieldMaestro
196	64	Ertuğrul Ersoy	2003-05-23	https://i.goalzz.com/?i=o%2fp%2f107%2f523%2fertugrul-ersoy-1.png	0	0	Channeling the love for the game down the flanks. On the way to ultimate wing wizardry 🕊️⚽.
222	45	Hasan Özkan	1990-03-08	https://i.goalzz.com/?i=esouza%2f275615.jpg	0	0	Channeling inner Banks and Buffon, your fearless shot-stopper 🧤⚽ #KeepingItClean
226	40	İbrahim Akdağ	1986-12-15	https://i.goalzz.com/?i=o%2fp%2f134%2f282%2fibrahim-akdag-1.png	0	0	In the trenches, fighting the good fight - your central defense specialist 🛡️⚽
225	39	Hüseyin Türkmen	1987-08-09	https://i.goalzz.com/?i=o%2fp%2f116%2f147%2fhuseyin-turkmen-1.png	0	0	In the heart of the battle, anchoring and sailing. #MidfieldGeneral
231	19	İsmail Yüksek	1989-02-18	https://i.goalzz.com/?i=o%2fp%2f157%2f99%2fismail-yuksek-1.png	0	0	Shielding and fielding at the heart of defence. Breakthrough? Not on my watch 👊⚽️ #WallWhisperer
261	20	Mert Topuz	1997-09-14	https://i.goalzz.com/?i=o%2fp%2f160%2f282%2fmert-topuz-1.png	0	0	Striking fear in the heart of the net, an executor who never forgets 🎯⚽.
249	20	Kerem Baykuş	1995-09-11	https://i.goalzz.com/?i=o%2fp%2f157%2f61%2fkerem-baykus-1.png	0	0	Midfield dynamo, on the pitch with a show. Commanding chaos, calm in control 😎⚽.
241	20	Kahraman Demirtaş	1981-11-21	https://i.goalzz.com/?i=o%2fp%2f165%2f856%2fkahraman-demirtas-1.png	0	0	The unbreachable wall, the guardian of the backline 🧱⚫ #DefenseGuard
260	22	Mert Müldür	1996-10-21	https://i.goalzz.com/?i=o%2fp%2f142%2f853%2fmert-muldur-1.png	0	0	Zeroing in from the wings, dashing, dancing, lived for the beautiful flings 💫⚽.
255	27	Koray Altınay	1991-04-07	https://i.goalzz.com/?i=hazzard%2fkoray.jpg	0	0	Sprinting the grass, racing the wind, an artist with the ball at his feet ⚠️⚽.
240	27	Kağan Moradoğlu	1987-08-03	https://i.goalzz.com/?i=o%2fp%2f163%2f238%2fkagan-moradaoglu-1.png	0	0	Outruns, outmaneuvers, simply outstanding on the wings 💨🌪️ #LightningWinger
230	30	İrfan Başaran	1985-09-12	https://i.goalzz.com/?i=o%2fp%2f162%2f358%2firfan-basaran-1.jpg	0	0	Lighting up the field from the flanks, catching the wind under my wings 💨⚽️ #WingWanderer
235	31	İzzet Çelik	1990-08-03	https://i.goalzz.com/?i=o%2fp%2f166%2f172%2fizzet-celik-1.png	0	0	Twisting, turning, looping, learning. Life's more fun on the wings 🌀⚽️ #FlankFunk
244	32	Kemal Aslan	1980-06-12	https://i.goalzz.com/?i=players%2fturkey%2faslan.jpg	0	0	Targets marked, shots charged. No respite for the nets ⚽️💥 #StrikerExtraordinaire
257	38	Mert Çetin	1990-06-03	https://i.goalzz.com/?i=o%2fp%2f148%2f653%2fmert-cetin-1.png	0	0	The safe hands between the sticks, foe of strikers, friend of clean sheets 🥅⚽.
251	38	Kerem Şen	1994-12-19	https://i.goalzz.com/?i=o%2fp%2f177%2f153%2fkerem-sen-1.png	0	0	Soldier of the flanks, quick as lighting, slippery as an eel 💨⚽.
238	39	Kaan Kanak	1983-12-09	https://i.goalzz.com/?i=o%2fp%2f107%2f540%2fkaan-kanak-1.png	0	0	Waving magic in the midfield, game-changer and the field's heartbeat 💓⚽ #MidfieldMagician
228	41	İbrahim Yılmaz	1987-06-21	https://i.goalzz.com/?i=o%2fp%2f163%2f64%2fibrahim-yilmaz-1.png	0	0	Saving nets, breaking sweats. The posts are my domain 🆘⚽️ #GoalieLife
233	42	İrfan Can Eğribayat	1988-03-24	https://i.goalzz.com/?i=o%2fp%2f88%2f429%2firfan-can-egribayat-1.png	0	0	Poetry in motion, at the heart of the action. Creating rhythms in the midfield 🕺⚽️ #FlowFinder
252	42	Kerem Ersuner	1994-01-30	https://i.goalzz.com/?i=o%2fp%2f161%2f543%2fkerem-yusuf-ersunar-1.jpg	0	0	Brick wall of the defense, stopping goals and creating immense 🚫⚽.
239	45	Kadir Seven	1984-07-15	https://i.goalzz.com/?i=o%2fp%2f173%2f112%2fkadir-seven-1.png	0	0	Hits the net like a thunderbolt, striker par excellence ⚡⚽️ #ThunderStriker
248	46	Kerem Kesgin	1992-03-08	https://i.goalzz.com/?i=gabas%2fkerem.jpg	0	0	Grit, grace, and goals galore, mastering the 18-yard lore 💫⚽.
254	48	Kerem Demirbay	1995-11-23	https://i.goalzz.com/?i=o%2fp%2f93%2f974%2fkerem-demirbay-2.png	0	0	Toppling defenders, threading the needle, striking gold ⚽️💥.
253	50	Kerim Frei	1993-05-14	https://i.goalzz.com/?i=o%2fp%2f80%2f809%2fkerim-frei-1.png	0	0	Dictating the tempo, mastering the rhythm, the pitch's puppeteer 🎩⚽.
232	50	İsmail Zehir	1986-07-30	https://i.goalzz.com/?i=o%2fp%2f171%2f139%2fismail-zehir-1.png	0	0	Split-second decisions, goal-bound precision. Finding net's my mission 🎯⚽ #BornStriker
227	53	İbrahim Pehlivan	1988-10-13	https://i.goalzz.com/?i=o%2fp%2f115%2f540%2fibrahim-pehlivan-1.png	0	0	On the lines, breaking the chains. Born to stop the shots. #DecisiveDefender
236	54	İzzet Karaboğa	1986-05-20	https://i.goalzz.com/?i=o%2fp%2f160%2f995%2fizzet-karaboga-1.png	0	0	Crafting defence like an artisan, brick by brick. The fortress stands tall ⚔️⚽️ #DefenceDoyen
229	55	İlkay Durmuş	1985-01-09	https://i.goalzz.com/?i=madridderb%2filkay.jpg	0	0	Striding through midfield, a nimble navigator of the pitch 🏆⚽️ #GrassGeographer
237	55	Kaan Ayhan	1984-10-23	https://i.goalzz.com/?i=o%2fp%2f75%2f856%2fkaan-ayhan-1.png	0	0	Tracing arcs and sparking cheers. Midfield maestro is here 🌟⚽️ #MidfieldMaverick
242	59	Kamil Ahmet Çörekçi	1985-09-30	https://i.goalzz.com/?i=kdlhf%2fkamil.jpg	0	0	Rules the roost between the posts, the custodian supreme 🥅🧤 #GuardianOfTheGoal
234	60	İrfan Can Kahveci	1987-11-15	https://i.goalzz.com/?i=o%2fp%2f107%2f588%2firfan-can-kahveci-1.png	0	0	Denying shots, defying odds. Keeper of the keeper's code 🥅🕶️ #NetProtector
250	61	Kerem Kalafat	1993-07-21	https://i.goalzz.com/?i=o%2fp%2f157%2f66%2fkerem-kalafat-1.png	0	0	Fearless guard in front of the net, keeper of the clean sheets, savior of bets 🧤⚽.
245	61	Kenan Karaman	1983-10-29	https://i.goalzz.com/?i=o%2fp%2f93%2f963%2fkenan-karaman-1.png	0	0	Flies through the flanks, eyes on the goal. Wing play reimagined 🚀⚽️ #WingWonder
256	63	Koray Kılınç	1992-09-25	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fkoraykilinc.gif	0	0	Storming from the back, the iron pillar of defense, won't crack ⛔⚽.
246	65	Kenan Yıldız	1983-01-14	https://i.goalzz.com/?i=o%2fp%2f178%2f534%2fkenan-yildiz-1.png	0	0	At the heart of the defense, the pillar that doesn't waver 🗼⚽️ #UltimateUpholder
259	47	Mert Hakan Yandaş	1995-07-27	https://i.goalzz.com/?i=o%2fp%2f128%2f429%2fmert-hakan-yandas-1.png	0	0	Fearless in the penalty box, making nets shiver and hearts rock 💥⚽.
265	35	Merih Demiral	1997-08-16	https://i.goalzz.com/?i=o%2fp%2f144%2f589%2fmerih-demiral-1.png	0	0	Between posts, a titan unmoved. For strikers, a riddle unsolved 🧤⚽.
288	50	Salih Özcan	1998-06-06	https://i.goalzz.com/?i=o%2fp%2f114%2f190%2fsalih-ozcan-2.png	0	0	One with the ball, striking goals, a game recall 🎯⚽.
282	21	Sadık Baş	1997-08-28	https://i.goalzz.com/?i=o%2fp%2f166%2f842%2fsadik-bas-1.png	0	0	Serpentine agility on the flanks. Speed and precision, enemies outranked 💨⚽.
295	21	Sedat Şahintürk	2000-05-18	https://i.goalzz.com/?i=anis%2f2017%2f08%2fsedat+sahinturk.jpg	0	0	Master of the wings, driving defense into the rings 🛹⚽.
263	21	Metehan Mert	1995-11-20	https://i.goalzz.com/?i=o%2fp%2f157%2f265%2fmetehan-mert-3.png	0	0	Resolute as a rock at the back, for strikers nightmare to hack 🛡️⚽.
294	22	Samet Can Özkan	1998-11-09	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fs.c.ozkan.jpg	0	0	A nightmare for keepers, within 18-yards, quite the fighter 🥊⚽.
276	23	Ömer Toprak	1997-04-17	https://i.goalzz.com/?i=o%2fp%2f42%2f588%2fomer-toprak-1.png	0	0	Unyielding pillar in defense, turning every attack into suspense 🛡️⚽️
267	24	Necip Uysal	1998-02-05	https://i.goalzz.com/?i=o%2fp%2f70%2f769%2fnecip-uysal-1.png	0	0	A fortress in the defense, breaking the dreams of offensive intents ⚔️⚽.
280	27	Ozan Tufan	1996-04-19	https://i.goalzz.com/?i=guardiolaaaaa%2fozan.jpg	0	0	Midfield mastermind. Pulling strings, bending things. Orchestrating wins 🏆⚽.
275	30	Ömer Beyaz	1995-08-03	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fo.beyaz.jpg	0	0	Speed governing the flanks, magic unfolds when the wingman cranks ⚡⚽️
285	34	Sakıp Aytaç	1999-03-31	https://i.goalzz.com/?i=o%2fp%2f115%2f602%2fsakib-aytac-1.png	0	0	Wind Whisperer. Whooshing down the wing, slicing the field like a king 👑⚽.
272	35	Okan Koçuk	1993-07-26	https://i.goalzz.com/?i=o%2fp%2f107%2f524%2fokan-kocuk-1.png	0	0	Engines roaring on the flanks, leaving defenders to walk the plank 🔥⚽️
268	38	Oğulcan Çağlayan	1997-03-12	https://i.goalzz.com/?i=omar_a%2fturk%2fgaziantepspor%2f1375881709-ogulcan-caglayan1.jpg	0	0	Crafting goals with precision, striker with a mission ⚽️💥
300	41	Selimcan Temel	2000-07-03	https://i.goalzz.com/?i=o%2fp%2f170%2f750%2fselimcan-temel-1.png	0	0	Roaring down the wing, zipping past everything. A side of sting, served with a swing 🚀⚽.
262	42	Mertcan Cam	1996-05-08	https://i.goalzz.com/?i=o%2fp%2f162%2f351%2fmertcan-cam-1.png	0	0	Turning the wheel in the middle, a spectacle of skills so subtle 🕹️⚽.
289	42	Salih Uçan	2000-01-14	https://i.goalzz.com/?i=o%2fp%2f90%2f810%2fsalih-ucan-1.png	0	0	Deft on the flanks, carrying the team on swift tanks 🚀⚽.
298	43	Selçuk İnan	1985-02-10	https://i.goalzz.com/?i=medalss%2f12.jpg	0	0	Battle-hardened goalie, not just part of the scenery, stand-up comedy for every penalty 🃏⚽.
287	44	Salih Kavrazlı	1997-12-22	https://i.goalzz.com/?i=kdlhf%2f21033.jpg	0	0	Guardian of the goal. Sharp eyes, swift dive, no hole 🕵️⚽.
299	44	Selim Ay	2002-11-10	https://i.goalzz.com/?i=33333345566%2fselim.jpg	0	0	Footwork slicker than a jazz quartet, stealing hearts as the net pirouette 💖⚽.
291	46	Samed Kılıç	1997-10-03	https://i.goalzz.com/?i=c.chihab%2fkilic.jpg	0	0	Shot-stopper extraordinaire, supreme guardian of the goal's lair 🦸⚽.
286	46	Salih Dursun	1995-11-06	https://i.goalzz.com/?i=o%2fp%2f102%2f12%2fsalih-dursun-1.png	0	0	Bulwark on the backline. Iron grit, no transgression shall permit 🛡️⚽.
269	46	Oğulcan Ulgun	1996-11-26	https://i.goalzz.com/?i=o%2fp%2f153%2f873%2fogulcan-ulgun-1.png	0	0	Executing silken skills on the flanks, your favorite wing commander in action 🕊️⚽️
271	47	Oğuzhan Özyakup	1995-01-15	https://i.goalzz.com/?i=o%2fp%2f55%2f517%2foguzhan-ozyakup-1.png	0	0	Intrepid guardian of the goal, saying 'No Entry' to every roll 🧤⛔️
270	47	Oğuz Ceylan	1997-07-19	https://i.goalzz.com/?i=o%2fp%2f153%2f861%2foguz-ceylan-1.png	0	0	Manoeuvering the midfield magic, setting the game's rhythm, and never static 🛠️⚽️
296	48	Sefa Öztürk	1997-02-28	https://i.goalzz.com/?i=o%2fp%2f166%2f413%2fsefa-ozdemir-1.png	0	0	Unyielding at the back, for attackers, an constant wrack 🏰⚽.
266	48	Nazım Sangare	1996-06-27	https://i.goalzz.com/?i=o%2fp%2f144%2f478%2fnazim-sangare-1.png	0	0	Classic midfield maestro, pulling strings, creating the perfect show 🎩⚽.
274	49	Ömer Bayram	1997-10-09	https://i.goalzz.com/?i=medalss%2f11.jpg	0	0	Leading the offensive line, a predator in the 18-yard shrine 🏹⚽️
293	50	Samet Akaydın	1994-07-04	https://i.goalzz.com/?i=o%2fp%2f163%2f62%2fsamet-akaydin-2.png	0	0	Midfield maestro, conducting the orchestra, game's curator 🪄⚽.
290	52	Samed Kaya	1999-08-17	https://i.goalzz.com/?i=33333345566%2fsamed.jpg	0	0	Dictating from the center, paints the match's texture 🎨⚽.
279	54	Orkun Kökçü	1998-02-17	https://i.goalzz.com/?i=o%2fp%2f137%2f406%2forkun-kokcu-1.png	0	0	Flanks are my stage, outpacing rage. Each cross, a well-scripted page 📖⚽.
273	56	Okay Yokuşlu	1996-02-21	https://i.goalzz.com/?i=ashrafzamrani%2fokay+yokuslu.gif	0	0	Setting up play and dictating the day, midfield maestro in the fray 👑⚽️
292	56	Samed Onur	1999-04-23	https://i.goalzz.com/?i=o%2fp%2f166%2f813%2fsamed-onur-1.png	0	0	Speed, skill, surprise on the wings, a footballer who sings 🎵⚽.
283	59	Sadık Çiftpınar	1996-05-12	https://i.goalzz.com/?i=guardiolaaaaa%2fsadikdetay.jpg	0	0	Ground commander. Regal, stand taller. Midfield enchanter 🎭⚽.
281	57	Ramazan Civelek	1998-07-23	https://i.goalzz.com/?i=o%2fp%2f31%2f731%2framazan-civelek-1.png	0	0	Gaoler of the goal. Shots sizzled, attempts fizzled 🧤⚽.
284	60	Sefa Kınalı	1998-09-15	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fsafakinali.gif	0	0	Pointman perfection. Cracking defenses, cultured in precision ⚔️⚽.
297	62	Sefa Yılmaz	1990-09-22	https://i.goalzz.com/?i=o%2fp%2f101%2f949%2fsefa-yilmaz-1.png	0	0	Safe hands, swift feet, in the goal, firm seat 🧤⚽.
278	63	Onuralp Çevikkan	1999-01-25	https://i.goalzz.com/?i=o%2fp%2f178%2f397%2fonuralp-cevikkan-1.png	0	0	Striker Supreme. Each goal, a dream standing tall in the green 🥅⚽.
329	39	Tarkan Serbest	1994-02-08	https://i.goalzz.com/?i=o%2fp%2f134%2f915%2ftarkan-serbest-1.png	0	0	Wings are my domain, pace is my game 🚀⚽.
318	36	Sıddık Çelik	2004-12-28	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fs.celik.jpg	0	0	Redefining the striker's tale, when I hit, it never fails ⚽️💥.
325	17	Taha Tunç	2004-07-18	https://i.goalzz.com/?i=o%2fp%2f157%2f62%2ftaha-tunc-1.png	0	0	Rapid flanks, fierce tanks, expectations outranks 💨⚽.
307	18	Serdar Özkan	1987-01-01	https://i.goalzz.com/?i=buna%2f2018-11-21_18-50-38.jpg	0	0	Between the sticks, a force to reckon. On my watch, the goal's a no-fly beacon 🎯⚽.
302	18	Semih Kılıçsoy	2003-02-14	https://i.goalzz.com/?i=o%2fp%2f181%2f768%2fsemih-kilicsoy-1.png	0	0	The defense's ferocious boss, attackers left at a loss 🛡️⚽.
330	19	Tayfun Aydoğan	2006-03-13	https://i.goalzz.com/?i=o%2fp%2f166%2f401%2ftayfun-aydogan-1.png	0	0	Midfield magician, orchestrating the game with precision 🎩⚽.
306	22	Serdar Gürler	1991-09-09	https://i.goalzz.com/?i=o%2fp%2f71%2f235%2fserdar-gurler-2.png	0	0	In the trenches, fighting the fight. Turn back, or endure the defender's might ⚔⚽.
313	23	Serkan Asan	2002-05-24	https://i.goalzz.com/?i=kdlhf%2fserkan.jpg	0	0	Commands the wing area, a sight scarier for the defenders 🕊️⚽.
321	24	Sinan Osmanoğlu	1990-06-30	https://i.goalzz.com/?i=o%2fp%2f173%2f311%2fsinan-osmanoglu-1.png	0	0	Goalkeeper in command, breach my defense if you can 🥅⛔.
301	25	Semih Karadeniz	2001-01-25	https://i.goalzz.com/?i=33333345566%2fsemih.jpg	0	0	Calm in the chaos, guiding force of the team's cosmos. Our midfield maestro 🎹⚽.
317	26	Servet Çetin	1981-10-04	https://i.goalzz.com/?i=players%2fturkey%2fserv.jpg	0	0	On the flanks with the ball, makes my opponents' jaws fall 😱⚽.
308	27	Serdar Poyraz	2002-06-14	https://i.goalzz.com/?i=o%2fp%2f161%2f411%2fserdar-poyraz-1.png	0	0	Precision with every shot, strikers' role is what I've got 🌠⚽.
320	30	Sinan Kurt	1995-03-02	https://i.goalzz.com/?i=o%2fp%2f166%2f171%2fsinan-kurt-1.png	0	0	An artist in midfield, dance of dominance mildly veiled 🎼⚽.
328	32	Tarık Çetin	1997-10-14	https://i.goalzz.com/?i=hghf%2ftarik.jpg	0	0	Goals are my language, the pitch is my stage ⚽️🎭.
335	33	Tolga Ciğerci	1992-03-23	https://i.goalzz.com/?i=o%2fp%2f72%2f684%2ftolga-cigerci-1.png	0	0	Running down the wings, a song the crowd sings 🎵⚽.
339	34	Ufuk Akyol	1997-08-27	https://i.goalzz.com/?i=o%2fp%2f153%2f957%2fufuk-akyol-1.png	0	0	Wing warrior, football's charmer ☄⚽.
312	34	Serhat Ahmetoğlu	2003-07-31	https://i.goalzz.com/?i=o%2fp%2f162%2f93%2fserhat-ahmetoglu-1.png	0	0	Unleashes venom with every strike, keepers' fright in the night 🦂⚽.
304	35	Serdar Aziz	1990-10-23	https://i.goalzz.com/?i=o%2fp%2f70%2f984%2fserdar-aziz-1.png	0	0	Whipping up whirlwinds from the wing, leaving defenders in a fling 💫⚽.
310	36	Sergen Picinciol	1997-04-29	https://i.goalzz.com/?i=o%2fp%2f166%2f353%2fsergen-picinciol-1.png	0	0	Master of the pitch's pace, midfield is my space 🌌⚽.
314	36	Serkan Göksu	1993-08-16	https://i.goalzz.com/?i=o%2fp%2f173%2f223%2fserkan-goksu-1.png	0	0	Midfield maestro with the ball, opponents are at my beck and call 🎩⚽.
337	37	Tolgay Arslan	1990-08-16	https://i.goalzz.com/?i=o%2fp%2f84%2f587%2ftolgay-arslan-1.png	0	0	Between the posts, a bulwark, deterrence spoke 🚧⚽.
316	38	Serkan Özbalta	1979-02-05	https://i.goalzz.com/?i=o%2fp%2f170%2f832%2fserkan-ozbalta-1.png	0	0	A sorcerer with the ball at foot, through the net, every shot I put ⚡⚽.
326	38	Taha Yalçıner	2005-02-28	https://i.goalzz.com/?i=buff%2ftaha-yalciner.jpg	0	0	efensive wall, standing tall, deters all 🛡️⚽.
305	44	Serdar Dursun	1991-10-19	https://i.goalzz.com/?i=o%2fp%2f155%2f891%2fserdar-dursun-1.png	0	0	Midfield's metronome. Control, distribute, repeat. Football's poem in repeat 📘⚽.
332	45	Taylan Antalyalı	1995-05-23	https://i.goalzz.com/?i=o%2fp%2f107%2f597%2ftaylan-antalyali-1.png	0	0	Attacking the flanks, breaking ranks, gets the thanks 👊⚽.
309	48	Serdar Saatçi	2003-09-27	https://i.goalzz.com/?i=o%2fp%2f161%2f583%2fserdar-saatci-2.png	0	0	Battles on the flanks, tearing up the tanks 🚀⚽.
311	49	Sergen Yatağan	2004-02-20	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fs.yatagan.jpg	0	0	Steady at the rear, putting attackers' dreams to sear 🔥⚽.
333	50	Tayyip Sanuc	2006-12-08	https://i.goalzz.com/?i=o%2fp%2f166%2f155%2ftayyip-sanuc-1.png	0	0	The heart of the midfield, a shield and a sword 🛡️⚔️⚽.
327	53	Talha Ülvan	2004-11-04	https://i.goalzz.com/?i=o%2fp%2f175%2f341%2ftalha-ulvan-1.png	0	0	Shot-stopper, game topper, attackers' draughts prosper 🥅✨.
334	55	Tiago Çukur	2002-04-01	https://i.goalzz.com/?i=o%2fp%2f172%2f486%2ftiago-cukur-1.png	0	0	Striking goals with might, shining bright in the spotlight 💡⚽.
338	55	Tunahan Taşçı	2001-09-04	https://i.goalzz.com/?i=o%2fp%2f173%2f435%2ftunahan-tasci-1.png	0	0	Taming the ball, curating goal galleries for all ⚽️🎨.
319	66	Sinan Bolat	1988-09-03	https://i.goalzz.com/?i=o%2fp%2f59%2f538%2fsinan-bolat-1.png	0	0	Soaring down the wings, a nightmare in defenders' dreams 🦅⚽.
303	62	Şener Özbayraklı	2003-08-19	https://i.goalzz.com/?i=o%2fp%2f107%2f522%2fsener-ozbayrakli-1.png	0	0	Eye for goal. Cool under pressure. Your worst nightmare, goalie's oppressor ⚽️🎯.
323	63	Süleyman Cebeci	2005-04-25	https://i.goalzz.com/?i=o%2fp%2f163%2f240%2fsuleyman-cebeci-1.png	0	0	In the midfield, rules bend, creates the tempo, sets the trend ⏳⚽.
315	64	Serkan Kırıntılı	2001-12-30	https://i.goalzz.com/?i=33333345566%2fprsnda.jpg	0	0	Tower of strength at the back, attackers' attacks are out of whack 🗼⚽.
340	65	Uğur Arslan Kuru	1989-02-16	https://i.goalzz.com/?i=katkotati%2ffootballer%2ftur%2fugur-kuru.jpg	0	0	Midfield maestro, engine never slow 🎶⚽.
324	65	Taha Tepe	2006-10-09	https://i.goalzz.com/?i=o%2fp%2f157%2f57%2ftaha-tepe-1.png	0	0	Cracks the net, striking right, spotlights on my goal flight 🚀⚽.
201	16	Furkan Akyüz	2002-02-26	https://i.goalzz.com/?i=o%2fp%2f179%2f851%2ffurkan-akyuz-1.png	0	0	Born to strike ⚽💥! Calls the 18-yard box home and has a knack for finding the net.
331	16	Tayfur Bingol	1993-04-19	https://i.goalzz.com/?i=o%2fp%2f90%2f829%2ftayfur-bingol-1.png	0	0	Goalkeeper supreme, the dream of every team 🧤⚽.
277	16	Onur Bulut	1995-09-25	https://i.goalzz.com/?i=o%2fp%2f125%2f581%2fonur-bulut-1.png	0	0	Agile hands, firm stance, guardianship of the goal at a glance 🚫⚽️
53	16	Ahmet Kartal	1995-06-30	https://i.goalzz.com/?i=o%2fp%2f159%2f624%2fahmet-zekeriyya-kart-1.jpg	0	0	Defense and attack? I've got both on lock. Forward dribblers, you've been warned. #FullbackFearFactor
102	16	Alperen Uysal	1997-02-16	https://i.goalzz.com/?i=o%2fp%2f106%2f347%2falperen-uysal-1.png	0	0	Winger who whisks through wide lanes like a windstorm, unwrapping defenses like Christmas gifts.🎁💨
354	17	Yavuz Buğra Boyar	1998-08-10	https://i.goalzz.com/?i=o%2fp%2f160%2f234%2fyavuz-bugra-boyar-1.png	0	0	Striker's tale, where words fail, goals prevail 🎯⚽.
258	17	Mert Günok	1997-02-15	https://i.goalzz.com/?i=medalss%2f2018-11-19_12-51-44.jpg	0	0	Dancing with the ball at my feet, creating wizardry, a spectacle hard to beat 😎⚽.
365	17	Zeki Yavru	1991-09-05	https://i.goalzz.com/?i=o%2fp%2f90%2f819%2fzeki-yavru-1.png	0	0	Wing conqueror, skill glosser, game enhancer 🦅⚽.
356	48	Yiğit Kafkasyalı	1998-06-13	https://i.goalzz.com/?i=o%2fp%2f153%2f976%2fyigit-kafkasyali-2.png	0	0	Fortress in defense, repelling every offense 🏰⚽.
157	18	Efecan Karaca	1995-07-14	https://i.goalzz.com/?i=o%2fp%2f57%2f464%2fefecan-karaca-1.png	0	0	Playmaker 🔵⚽. He weaves threads of gameplay effortlessly, like a maestro conducting a grand symphony.
362	18	Yusuf Yazıcı	1997-01-29	https://i.goalzz.com/?i=o%2fp%2f105%2f631%2fyusuf-yazici-1.png	0	0	Flank specialist, skill economist, precision optimist 🎯⚽.
16	19	İlhan Parlak	1987-01-19	https://i.goalzz.com/?i=o%2fp%2f25%2f545%2f304lhan-parlak-1.png	0	0	📍Izmir, Turkey | ⚽ Midfielder | 💫 Dreaming Big | 🎓Ege University | 🚀 Free-kick Specialist.
360	19	Yusuf Erdoğan	1994-12-12	https://i.goalzz.com/?i=o%2fp%2f102%2f1%2fyusuf-erdogan-1.png	0	0	Tempo setter, game better, midfield letter 🖋️⚽.
56	21	Ahmet Özden	1992-07-16	https://i.goalzz.com/?i=o%2fp%2f115%2f603%2fahmet-ozden-1.png	0	0	Midfield's my stage, football's my script. Pulling the strings between the white lines. #GamePlayGuru
366	21	Ziya Erdal	1988-01-05	https://i.goalzz.com/?i=iscoooo%2fziyad.jpg	0	0	Defense fortress, attack stress, clean success 🛡️⚽.
243	23	Kazımcan Karataş	1988-04-26	https://i.goalzz.com/?i=o%2fp%2f166%2f424%2fkazimcan-karatas-1.png	0	0	A maestro in cleats, turns games around in the midfield like clockwork 🎼⚽ #MidfieldMaestro
344	24	Umut Bozok	1996-09-10	https://i.goalzz.com/?i=o%2fp%2f131%2f845%2fumut-bozok-1.png	0	0	Scoring spree, unlocking defenses key 🔑⚽.
347	25	Umut Nayir	1993-06-28	https://i.goalzz.com/?i=o%2fp%2f101%2f962%2fumut-nayir-2.png	0	0	Saving shots, guarding slots, connecting the dots 🧮⚽.
352	26	Yasin Öztekin	1987-07-14	https://i.goalzz.com/?i=per%2fyasisn.jpg	0	0	Master of the flank, with skills worth every franc ⚡⚽.
264	27	Murat Sipahioğu	1998-04-30	https://i.goalzz.com/?i=o%2fp%2f159%2f629%2fmurat-sipahioglu-1.jpg	0	0	Lightning speed, razor sharp cross, your favorite wing boss 💨⚽.
358	29	Yunus Akgün	2000-07-07	https://i.goalzz.com/?i=o%2fp%2f130%2f553%2fyunus-akgun-1.png	0	0	Clinical striker, goal provider, joy rider ⛹️⚽.
361	29	Yusuf Sarı	1998-04-21	https://i.goalzz.com/?i=o%2fp%2f145%2f66%2fyusuf-sari-1.png	0	0	Goal gatekeeper, attackers' experience reaper 🧤⚽.
359	30	Yunus Mallı	1992-04-17	https://i.goalzz.com/?i=o%2fp%2f61%2f837%2fyunus-malli-1.png	0	0	Fierce flank, skill tank, opposition sank ⚡⚽.
220	31	Hasan Ali Kaldırım	1987-01-18	https://i.goalzz.com/?i=o%2fp%2f90%2f809%2fhasan-ali-kaldirim-1.png	0	0	Quick on my feet, quicker on the retreat. Your friendly neighbourhood full-back ⚔️⚽
363	32	Zafer Görgen	2000-06-21	https://i.goalzz.com/?i=hghf%2fresim.jpg	0	0	Midfield orchestrator, opposition's dictator 🎼⚽.
357	33	Yiğithan Güveli	1998-05-16	https://i.goalzz.com/?i=o%2fp%2f31%2f877%2fyigithan-guveli-1.png	0	0	Gloved gladiator, defensive vindicator, strikers' eliminator 🥅👊.
342	37	Uğur Uçar	1987-04-05	https://i.goalzz.com/?i=medalss%2f2018-11-19_21-32-29.jpg	0	0	Flitting on the flanks, skills deserving thanks 🦋⚽.
350	39	Veysel Ünal	2001-07-03	https://i.goalzz.com/?i=o%2fp%2f157%2f84%2fveysel-unal-1.png	0	0	Midfield's emperor, games were his concert, the pitch was his parlor 👑⚽.
346	40	Umut Meraş	1995-12-20	https://i.goalzz.com/?i=ggdytw%2fv_685.jpg	0	0	Stern at the back, from attackers nothing to lack 💪⚽.
349	40	Veysel Sarı	1988-04-12	https://i.goalzz.com/?i=o%2fp%2f110%2f504%2fveysel-sari-1.png	0	0	Dictating the wing's tempo, a legacy hard to let go 🕊️⚽.
351	29	Volkan Babacan	1988-08-11	https://i.goalzz.com/?i=o%2fp%2f45%2f536%2fvolkan-babacan-1.png	0	0	Unwavering guardian of the goal, his saves made us whole 🧤⚽.
345	43	Umut Bulut	1983-03-15	https://i.goalzz.com/?i=hated%2fumut.jpg	0	0	Power on the flanks, pushing up the ranks 🔌⚽.
135	44	Ceyhun Gülselam	1990-03-03	https://i.goalzz.com/?i=jmal%2fceyhun.jpg	0	0	A behemoth between the sticks, I am the anvil upon which opposition dreams are shattered.
353	49	Yavuz Aygün	1996-06-27	https://i.goalzz.com/?i=o%2fp%2f162%2f859%2fyavuz-aygun-1.png	0	0	Quarterback of the pitch, passes stitched, matches bewitched 📖⚽.
348	55	Vedat Karakuş	1975-04-18	https://i.goalzz.com/?i=o%2fp%2f144%2f653%2fvedat-karakus-1.png	0	0	Proven prowess in goal-scoring, a living legend in the making ⚽️🔥.
364	61	Zeki Çelik	1997-02-17	https://i.goalzz.com/?i=o%2fp%2f129%2f803%2fzeki-celik-1.png	0	0	Goal assailant, precision consultant, game resultant ⚽️💡.
343	64	Uğurcan Çakır	1996-04-05	https://i.goalzz.com/?i=o%2fp%2f101%2f992%2fugurcan-cakir-1.png	0	0	Dictating the game, making fame in the midfield lane 🚦⚽.
183	33	Erdal Kılıçaslan	2003-09-07	https://i.goalzz.com/?i=omar_a%2feuro%2fosmanlispor_%2f2016-08-26_225714.jpg	0	0	"They call me the Wing Commander 👨‍✈️ Driven, dedicated, and a touch speedy at 20. Strap in, it's gonna be a wild ride! 🔵⚽."
322	34	Soner Aydoğdu	1991-01-05	https://i.goalzz.com/?i=o%2fp%2f90%2f818%2fsoner-aydogdu-1.png	0	0	Master of the wings, knows all the beautiful things 🏞️⚽.
136	35	Cihan Karaman	1992-06-16	https://i.goalzz.com/?i=teams%2fgermany%2ffc_union-berlin%2fcihan-kahraman.jpg	0	0	Whisperer to the spherical muse, my dance on the field orchestrates tales of triumphant toil.
96	49	Alper Uludağ	1990-06-12	https://i.goalzz.com/?i=o%2fp%2f107%2f452%2falper-uludag-1.png	0	0	Conductor of the midfield symphony. Also known to dabble in amateur squirrel photography 🐿️🎶
355	49	Yavuz Ulaş Genç	2001-03-10	https://i.goalzz.com/?i=o%2fp%2f160%2f968%2fyavuz-ulas-genc-1.jpg	0	0	Dashes on the flanks, filling in the ranks, fans give thanks 💨⚽.
50	56	Ahmet Gürleyen	1992-03-11	https://i.goalzz.com/?i=teams%2fgermany%2ffsv_mainz_05_%2fahmet_gurleyen.jpg	0	0	Not all heroes wear capes, some guard net posts. Best goalkeeper this side of the solar system. 🚀 #StarKeeper
82	64	Ali Yavuz Kol	1996-07-07	https://i.goalzz.com/?i=o%2fp%2f144%2f29%2fali-yavuz-kol-1.jpg	0	0	Zipping down the pitch like a gazelle with jetpacks. ‘The Winged Wonder’ to my postman. 🚀📬
336	65	Tolga Kalendar	2007-02-03	https://i.goalzz.com/?i=o%2fp%2f166%2f156%2ftolga-kalender-1.png	0	0	A fortress in the defense, breaking down opponent's offense 🏰⚽.
210	66	Göktan Gurpuz	1990-06-15	https://i.goalzz.com/?i=o%2fp%2f173%2f305%2fgoktan-gurpuz-2.png	0	0	Controls the game from the backline, playing defensive notes that echo resilience and tenacity 💪⚽.
247	66	Kerem Aktürkoğlu	1984-05-19	https://i.goalzz.com/?i=o%2fp%2f159%2f392%2fmuhammed-kerem-aktur-1.png	0	0	Denying every inch of space, the goalkeeper who dares to defy 🚫⚽ #DenialDynamo
\.


--
-- TOC entry 3795 (class 0 OID 16522)
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
51	Zeynep Kutlu	1982-03-04	zeynep.kutlu@flos.com	https://i.goalzz.com/?i=00mohamed%40%2fmlaeb%2f22.jpg	Category C
40	Yunus Yıldırım	1990-12-16	yunus.yildirim@flos.com	https://i.goalzz.com/?i=youness2%2f18287.jpg	Category B
\.


--
-- TOC entry 3805 (class 0 OID 16693)
-- Dependencies: 231
-- Data for Name: Statistics; Type: TABLE DATA; Schema: public; Owner: Emrecan
--

COPY public."Statistics" ("clubId", "leagueId", "winCount", "drawCount", "loseCount", scored, conceded) FROM stdin;
24	12	0	0	0	0	0
16	12	0	0	0	0	0
21	12	0	0	0	0	0
37	12	0	0	0	0	0
66	12	0	0	0	0	0
17	12	0	0	0	0	0
40	12	0	0	0	0	0
36	12	0	0	0	0	0
39	12	0	1	0	10	10
38	12	0	1	0	10	10
\.


--
-- TOC entry 3797 (class 0 OID 16533)
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
-- TOC entry 3823 (class 0 OID 0)
-- Dependencies: 229
-- Name: Club_clubId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Club_clubId_seq"', 66, true);


--
-- TOC entry 3824 (class 0 OID 0)
-- Dependencies: 232
-- Name: Fixture_fixtureId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Fixture_fixtureId_seq"', 180, true);


--
-- TOC entry 3825 (class 0 OID 0)
-- Dependencies: 223
-- Name: League_leagueId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."League_leagueId_seq"', 29, true);


--
-- TOC entry 3826 (class 0 OID 0)
-- Dependencies: 224
-- Name: League_organizerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."League_organizerId_seq"', 1, false);


--
-- TOC entry 3827 (class 0 OID 0)
-- Dependencies: 216
-- Name: Organizer_organizerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Organizer_organizerId_seq"', 55, true);


--
-- TOC entry 3828 (class 0 OID 0)
-- Dependencies: 217
-- Name: Participant_participantId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Participant_participantId_seq"', 362, true);


--
-- TOC entry 3829 (class 0 OID 0)
-- Dependencies: 226
-- Name: Player_playerId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Player_playerId_seq"', 366, true);


--
-- TOC entry 3830 (class 0 OID 0)
-- Dependencies: 219
-- Name: Referee_refereeId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Referee_refereeId_seq"', 57, true);


--
-- TOC entry 3831 (class 0 OID 0)
-- Dependencies: 221
-- Name: Venue_venueId_seq; Type: SEQUENCE SET; Schema: public; Owner: Emrecan
--

SELECT pg_catalog.setval('public."Venue_venueId_seq"', 57, true);


--
-- TOC entry 3615 (class 2606 OID 16681)
-- Name: Club club_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT club_pk PRIMARY KEY ("clubId");


--
-- TOC entry 3619 (class 2606 OID 16719)
-- Name: Fixture fixture_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_pk PRIMARY KEY ("fixtureId");


--
-- TOC entry 3611 (class 2606 OID 16581)
-- Name: League league_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT league_pk PRIMARY KEY ("leagueId");


--
-- TOC entry 3593 (class 2606 OID 16481)
-- Name: Organizer organizer_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_email_uk UNIQUE (email);


--
-- TOC entry 3595 (class 2606 OID 16457)
-- Name: Organizer organizer_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_pk PRIMARY KEY ("organizerId");


--
-- TOC entry 3597 (class 2606 OID 16465)
-- Name: Organizer organizer_username_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Organizer"
    ADD CONSTRAINT organizer_username_uk UNIQUE (username);


--
-- TOC entry 3599 (class 2606 OID 16483)
-- Name: Participant participant_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_email_uk UNIQUE (email);


--
-- TOC entry 3601 (class 2606 OID 16448)
-- Name: Participant participant_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_pk PRIMARY KEY ("participantId");


--
-- TOC entry 3603 (class 2606 OID 16473)
-- Name: Participant participant_username_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_username_uk UNIQUE (username);


--
-- TOC entry 3621 (class 2606 OID 16751)
-- Name: Performance performance_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_pk PRIMARY KEY ("playerId", "fixtureId");


--
-- TOC entry 3613 (class 2606 OID 16627)
-- Name: Player player_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT player_pk PRIMARY KEY ("playerId");


--
-- TOC entry 3605 (class 2606 OID 16531)
-- Name: Referee referee_email_uk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee"
    ADD CONSTRAINT referee_email_uk UNIQUE (email);


--
-- TOC entry 3607 (class 2606 OID 16529)
-- Name: Referee referee_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Referee"
    ADD CONSTRAINT referee_pk PRIMARY KEY ("refereeId");


--
-- TOC entry 3617 (class 2606 OID 16702)
-- Name: Statistics statistics_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_pk PRIMARY KEY ("clubId", "leagueId");


--
-- TOC entry 3609 (class 2606 OID 16540)
-- Name: Venue venue_pk; Type: CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Venue"
    ADD CONSTRAINT venue_pk PRIMARY KEY ("venueId");


--
-- TOC entry 3625 (class 2606 OID 16682)
-- Name: Club club_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT club_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


--
-- TOC entry 3628 (class 2606 OID 16730)
-- Name: Fixture fixture_club_away_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_club_away_fk FOREIGN KEY ("awayClubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3629 (class 2606 OID 16725)
-- Name: Fixture fixture_club_home_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_club_home_fk FOREIGN KEY ("homeClubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3630 (class 2606 OID 16720)
-- Name: Fixture fixture_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


--
-- TOC entry 3631 (class 2606 OID 16735)
-- Name: Fixture fixture_referee_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_referee_fk FOREIGN KEY ("refereeId") REFERENCES public."Referee"("refereeId");


--
-- TOC entry 3632 (class 2606 OID 16740)
-- Name: Fixture fixture_venue_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Fixture"
    ADD CONSTRAINT fixture_venue_fk FOREIGN KEY ("venueId") REFERENCES public."Venue"("venueId");


--
-- TOC entry 3624 (class 2606 OID 16588)
-- Name: League league_organizer_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."League"
    ADD CONSTRAINT league_organizer_fk FOREIGN KEY ("organizerId") REFERENCES public."Organizer"("organizerId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3622 (class 2606 OID 16687)
-- Name: Participant participant_club_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_club_fk FOREIGN KEY ("clubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3623 (class 2606 OID 16668)
-- Name: Participant participant_player_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT participant_player_fk FOREIGN KEY ("playerId") REFERENCES public."Player"("playerId");


--
-- TOC entry 3633 (class 2606 OID 16757)
-- Name: Performance performance_fixture_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_fixture_fk FOREIGN KEY ("fixtureId") REFERENCES public."Fixture"("fixtureId");


--
-- TOC entry 3634 (class 2606 OID 16752)
-- Name: Performance performance_player_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Performance"
    ADD CONSTRAINT performance_player_fk FOREIGN KEY ("playerId") REFERENCES public."Player"("playerId");


--
-- TOC entry 3626 (class 2606 OID 16703)
-- Name: Statistics statistics_club_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_club_fk FOREIGN KEY ("clubId") REFERENCES public."Club"("clubId");


--
-- TOC entry 3627 (class 2606 OID 16708)
-- Name: Statistics statistics_league_fk; Type: FK CONSTRAINT; Schema: public; Owner: Emrecan
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT statistics_league_fk FOREIGN KEY ("leagueId") REFERENCES public."League"("leagueId");


-- Completed on 2024-01-03 23:45:42 +03

--
-- PostgreSQL database dump complete
--

