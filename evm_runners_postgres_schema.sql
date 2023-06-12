--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)

-- Started on 2023-03-19 15:06:03 WET

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
-- TOC entry 5 (class 2615 OID 16674)
-- Name: evm_runners; Type: SCHEMA; Schema: -; Owner: evm_runners
--

CREATE SCHEMA evm_runners;


ALTER SCHEMA evm_runners OWNER TO evm_runners;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16675)
-- Name: levels; Type: TABLE; Schema: evm_runners; Owner: evm_runners
--

CREATE TABLE evm_runners.levels (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    "position" integer NOT NULL,
    test_contract character varying(100) NOT NULL
);


ALTER TABLE evm_runners.levels OWNER TO evm_runners;

--
-- TOC entry 211 (class 1259 OID 16678)
-- Name: levels_id_seq; Type: SEQUENCE; Schema: evm_runners; Owner: evm_runners
--

CREATE SEQUENCE evm_runners.levels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE evm_runners.levels_id_seq OWNER TO evm_runners;

--
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 211
-- Name: levels_id_seq; Type: SEQUENCE OWNED BY; Schema: evm_runners; Owner: evm_runners
--

ALTER SEQUENCE evm_runners.levels_id_seq OWNED BY evm_runners.levels.id;


--
-- TOC entry 212 (class 1259 OID 16679)
-- Name: submissions; Type: TABLE; Schema: evm_runners; Owner: evm_runners
--

CREATE TABLE evm_runners.submissions (
    id bigint NOT NULL,
    level_id integer NOT NULL,
    user_id integer NOT NULL,
    bytecode text NOT NULL,
    gas numeric NOT NULL,
    size numeric NOT NULL,
    submitted_at timestamp NOT NULL,
    type character varying(100) NOT NULL,
    optimized_for character varying(100) NOT NULL
);


ALTER TABLE evm_runners.submissions OWNER TO evm_runners;

--
-- TOC entry 213 (class 1259 OID 16684)
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: evm_runners; Owner: evm_runners
--

CREATE SEQUENCE evm_runners.submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE evm_runners.submissions_id_seq OWNER TO evm_runners;

--
-- TOC entry 3386 (class 0 OID 0)
-- Dependencies: 213
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: evm_runners; Owner: evm_runners
--

ALTER SEQUENCE evm_runners.submissions_id_seq OWNED BY evm_runners.submissions.id;


--
-- TOC entry 214 (class 1259 OID 16685)
-- Name: users; Type: TABLE; Schema: evm_runners; Owner: evm_runners
--

CREATE TABLE evm_runners.users (
    id bigint NOT NULL,
    pin text UNIQUE NOT NULL,
    discord_id bigint UNIQUE NOT NULL,
    name character varying(100) NOT NULL,
    code text NOT NULL,
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    expires_in timestamp NOT NULL,
    admin boolean DEFAULT false NOT NULL
);


ALTER TABLE evm_runners.users OWNER TO evm_runners;

--
-- TOC entry 215 (class 1259 OID 16688)
-- Name: users_id_seq; Type: SEQUENCE; Schema: evm_runners; Owner: evm_runners
--

CREATE SEQUENCE evm_runners.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE evm_runners.users_id_seq OWNER TO evm_runners;

--
-- TOC entry 3387 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: evm_runners; Owner: evm_runners
--

ALTER SEQUENCE evm_runners.users_id_seq OWNED BY evm_runners.users.id;


--
-- TOC entry 3218 (class 2604 OID 16689)
-- Name: levels id; Type: DEFAULT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.levels ALTER COLUMN id SET DEFAULT nextval('evm_runners.levels_id_seq'::regclass);


--
-- TOC entry 3219 (class 2604 OID 16690)
-- Name: submissions id; Type: DEFAULT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.submissions ALTER COLUMN id SET DEFAULT nextval('evm_runners.submissions_id_seq'::regclass);


--
-- TOC entry 3222 (class 2604 OID 16691)
-- Name: users id; Type: DEFAULT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.users ALTER COLUMN id SET DEFAULT nextval('evm_runners.users_id_seq'::regclass);


--
-- TOC entry 3224 (class 2606 OID 16693)
-- Name: levels levels_name_key; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.levels
    ADD CONSTRAINT levels_name_key UNIQUE (name);


--
-- TOC entry 3226 (class 2606 OID 16695)
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);


--
-- TOC entry 3228 (class 2606 OID 16697)
-- Name: levels levels_position_key; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.levels
    ADD CONSTRAINT levels_position_key UNIQUE ("position");


--
-- TOC entry 3230 (class 2606 OID 16699)
-- Name: levels levels_test_contract_key; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.levels
    ADD CONSTRAINT levels_test_contract_key UNIQUE (test_contract);


--
-- TOC entry 3232 (class 2606 OID 16701)
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 16703)
-- Name: submissions unique_level_user; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.submissions
    ADD CONSTRAINT unique_level_user_optimized_for UNIQUE (level_id, user_id, optimized_for);


--
-- TOC entry 3236 (class 2606 OID 16705)
-- Name: users users_name_key; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.users
    ADD CONSTRAINT users_name_key UNIQUE (name);


--
-- TOC entry 3238 (class 2606 OID 16707)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 16708)
-- Name: submissions level_fk; Type: FK CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.submissions
    ADD CONSTRAINT level_fk FOREIGN KEY (level_id) REFERENCES evm_runners.levels(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3240 (class 2606 OID 16713)
-- Name: submissions user_fk; Type: FK CONSTRAINT; Schema: evm_runners; Owner: evm_runners
--

ALTER TABLE ONLY evm_runners.submissions
    ADD CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES evm_runners.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2023-03-19 15:06:03 WET

--
-- PostgreSQL database dump complete
--
