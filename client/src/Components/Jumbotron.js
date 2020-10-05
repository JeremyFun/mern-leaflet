import React, {useState} from 'react';
import {Jumbotron as Jumbotrons, Button} from 'reactstrap';
import styled from "styled-components";

const Headline = styled.strong`
      font-size: 24px;
    font-style: italic;
    font-weight: bold;
`;

const Jumbotron = (props) => {
    const [learnMore, setLearnMore] = useState(false)

    return (
        <div>
            <Jumbotrons>
                <h1 className="display-3">Hello guests!</h1>
                <p className="lead">We are always happy to welcome our guests, we offer you the development of the
                    map.</p>
                <hr className="my-2"/>
                <p className="lead">
                </p>
                {
                    learnMore ?
                        <p className="lead">
                            <Headline>Wikimapia - </Headline>an international free website, an online geographic
                            encyclopedia whose purpose is to mark and
                            describe all geographic features on Earth. Wikimapia combines an interactive map with the
                            free
                            editing principle of a wiki. The project was founded by Alexander Koryakin and Evgeny
                            Savelyev
                            on May 24, 2006. Now more than 2.4 million users are registered on Wikimapia and more than
                            30
                            million objects have been added to the map (excluding subsequently deleted ones). All
                            Wikimapia
                            data is available for general use under the Creative Commons Attribution-ShareAlike 3.0
                            license.
                            The slogan of the project: "Let's describe the whole world!" (Let’s describe the whole
                            world!)
                            Is listed in the title of the site.
                            <br/><br/>
                            <Headline>Principles and goals </Headline>
                            The goal of the project is to collect and organize the most complete information about all
                            geographic objects on Earth and provide free access to it. Filling the site with information
                            occurs on the basis of crowdsourcing, that is, all information on Wikimapia is added by the
                            site users themselves (both registered and not) on their own initiative.

                            The name Wikimapia was chosen because the emergence of this geographic information project
                            was inspired by the success of Wikipedia, and Wikimapia also uses the principle of free wiki
                            editing; however, the Wikimedia Foundation has nothing to do with the origin of the project.
                            Wikimapia is not a funded foundation
                            <br/><br/>
                            <Headline>History </Headline>
                            The Wikimapia project was launched by Alexander Koryakin and Evgeny Savelyev on May 24, 2006, and in 84 days the first million objects were marked on the map. The first object marked on Wikimapia was the Auchan hypermarket on the Kaluzhskoe highway in Moscow.

                            Some statistics on the development of Wikimapia:

                            August 16, 2006 - the number of objects exceeded 1 million;
                            November 22, 2006 - the number of objects exceeded 2 million;
                            October 9, 2007 - the number of objects exceeded 5 million;
                            December 4, 2009 - API opening;
                            December 9, 2010 - The number of active Wikimapia member accounts exceeded 1,000,000;
                            <br/><br/>
                            <Headline>Principles and goals </Headline>
                            The goal of the project is to collect and organize the most complete information about all
                            geographic objects on Earth and provide free access to it. Filling the site with information
                            occurs on the basis of crowdsourcing, that is, all information on Wikimapia is added by the
                            site users themselves (both registered and not) on their own initiative.

                            The name Wikimapia was chosen because the emergence of this geographic information project
                            was inspired by the success of Wikipedia, and Wikimapia also uses the principle of free wiki
                            editing; however, the Wikimedia Foundation has nothing to do with the origin of the project.
                            Wikimapia is not a funded foundation
                            <br/><br/>
                            <Headline>History </Headline>
                            The Wikimapia project was launched by Alexander Koryakin and Evgeny Savelyev on May 24, 2006, and in 84 days the first million objects were marked on the map. The first object marked on Wikimapia was the Auchan hypermarket on the Kaluzhskoe highway in Moscow.

                            Some statistics on the development of Wikimapia:

                            August 16, 2006 - the number of objects exceeded 1 million;
                            November 22, 2006 - the number of objects exceeded 2 million;
                            October 9, 2007 - the number of objects exceeded 5 million;
                            December 4, 2009 - API opening;
                            December 9, 2010 - The number of active Wikimapia member accounts exceeded 1,000,000;
                        </p>
                        :
                        <>
                        <p className="lead">
                            <Headline>Wikimapia - </Headline>an international free website, an online geographic
                            encyclopedia whose purpose is to mark and
                            describe all geographic features on Earth. Wikimapia combines an interactive map with the
                            free
                            editing principle of a wiki. The project was founded by Alexander Koryakin and Evgeny
                            Savelyev
                            on May 24, 2006. Now more than 2.4 million users are registered on Wikimapia and more than
                            30
                            million objects have been added to the map (excluding subsequently deleted ones). All
                            Wikimapia
                            data is available for general use under the Creative Commons Attribution-ShareAlike 3.0
                            license.
                            The slogan of the project: "Let's describe the whole world!" (Let’s describe the whole
                            world!)
                            Is listed in the title of the site.
                            <br/><br/>
                            <Headline>Principles and goals </Headline>
                            The goal of the project is to collect and organize the most complete information about all
                            geographic objects on Earth and provide free access to it. Filling the site with information
                            occurs on the basis of crowdsourcing, that is, all information on Wikimapia is added by the
                            site users themselves (both registered and not) on their own initiative.

                            The name Wikimapia was chosen because the emergence of this geographic information project
                            was inspired by the success of Wikipedia, and Wikimapia also uses the principle of free wiki
                            editing; however, the Wikimedia Foundation has nothing to do with the origin of the project.
                            Wikimapia is not a funded foundation
                            <br/><br/>
                            <Headline>History </Headline>
                            The Wikimapia project was launched by Alexander Koryakin and Evgeny Savelyev on May 24, 2006, and in 84 days the first million objects were marked on the map. The first object marked on Wikimapia was the Auchan hypermarket on the Kaluzhskoe highway in Moscow.

                            Some statistics on the development of Wikimapia:
                        </p>
                            <Button color="primary"
                                    onClick={() => setLearnMore(!learnMore)}>
                                Learn More
                            </Button>
                        </>
                }
            </Jumbotrons>
        </div>
    );
};

export default Jumbotron;