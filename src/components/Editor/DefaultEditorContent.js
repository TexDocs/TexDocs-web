/* eslint-disable */
export const defaultEditorContent = `% arara: xelatex: { shell: yes }
% arara: makeglossaries
% arara: bibtex
% arara: xelatex: { shell: yes }

\\documentclass[a4paper]{report}

% Imports
\\usepackage[T1]{fontenc}
\\usepackage{fancyhdr}
\\usepackage{etoolbox}
\\usepackage{url}
\\usepackage{polyglossia}
\\usepackage{cite}
\\usepackage{minted}
\\usepackage{color}
\\usepackage{enumitem}
\\usepackage{filecontents}
\\usepackage{multirow}
\\usepackage{hyperref}
\\usepackage[acronym,toc]{glossaries}

% Command rewriting
\\renewcommand{\\listoflistingscaption}{List of schemes}
\\renewcommand{\\chaptername}{Section}

ewcommand{\\todo}[1]{}
\\renewcommand{\\todo}[1]{{\\color{red} TODO: {#1}}}


% Title page
\\title{ProtoMesh \\\\
    
oindent\\rule[0.25ex]{\\linewidth}{0.5pt}
    \\large A new approach to communication
}
\\author{Til Blechschmidt}
\\author{
  Blechschmidt, Til\\\\
  \\texttt{til@blechschmidt.de}
  \\and
  Peeters, Noah\\\\
  \\texttt{noah.peeters@icloud.com}
  \\and
  Brandt, Merlin\\\\
  \\texttt{merlin.brandt@hotmail.de}
}

% Glossary
\\makeglossaries


ewglossaryentry{node}{
    name=node,
    description={Physical device and participant in a network}
}

ewglossaryentry{endpoint}{
    name=endpoint,
    description={Point of interaction on a \\gls{device}}
}

ewglossaryentry{device}{
    name=device,
    description={Entity which consists of \\glspl{endpoint}}
}

ewglossaryentry{datagram}{
    name=datagram,
    description={Atomic unit of transmission with sufficient information to be routed to its destination through a network}
}

ewglossaryentry{bordercasting}{
    name=Bordercasting,
    description={Relaying a message to all nodes that are on the border of the local zone and thus $s_{zone}$ hops away}
}


ewacronym{zrp}{ZRP}{Zone Routing Protocol}

ewacronym{iarp}{IARP}{Intrazone Routing Protocol}

ewacronym{ierp}{IERP}{Interzone Routing Protocol}

ewacronym{uuid}{UUID}{Universally Unique Identifier}

ewacronym{rpc}{RPC}{Remote Procedure Call}


% Code highlighting
\\setminted[c++]{mathescape,linenos,numbersep=5pt,autogobble,frame=lines,framesep=2mm}

% Numbering
\\setcounter{secnumdepth}{3}

\\begin{document}
    \\pagenumbering{gobble}
	\\thispagestyle{fancy}
	\\maketitle
	
ewpage

	\\begin{abstract}
	    Most modern communication is running on top of the TCP/IP stack. It is the building block for the Internet as we know it today but since the stack was created the type of devices that use it shifted from stationary, big computers that are directly wired together to mobile, small devices and smart-phones. Most manufacturers made use of the existing infrastructure to connect these devices with each other and labeled it the Internet of Things. The devices changed but the stack persisted mostly in its original form. This white-paper aims to provide a new solution which takes the building blocks from the existing stacks and builds upon them to provide a better way for portable and small devices to interact with each other. It is crafted with the principles like security, anonymity and high performance at its core.\\\\
	    \\\\
	    This is \\emph{not} supposed to be replacing the TCP/IP stack since it aims at a drastically different crowd of devices that will utilize it but rather use the existing stack as one possible transmission medium for communication between devices. In a nutshell this provides a layer of abstraction for the communication between devices regardless of the medium and proposes a common way for devices to interact with each other in a unified language.
	\\end{abstract}
	
ewpage

	\\tableofcontents
	\\listoflistings
	For the most up-to-date list of schemes please refer to the \\href{https://github.com/TheMegaTB/ProtoMesh/tree/master/schemes}{GitHub repository}.
	
ewpage
	\\pagenumbering{arabic}

	% TODO Introduction

	\\chapter{Communication}
	    On the current market there are countless solutions for communication like Ethernet, WiFi, Bluetooth, Z-Wave or ZigBee just to name a few. Most of the time one of the latter is used to cover the last mile to a device whereas a specialized intermediate device translates it into one of the former. This results in situations where unnecessary long and indirect routes with translations along the way are used between devices that are just metres apart. Since many devices are already capable of more than one of the aforementioned carriers it only makes sense to extend on those capabilities.\\\\
	    To remove the need for translation, inefficient routes and specialized bridging devices a protocol that is carrier independent and unified is required. Such a standard would bridge the gap of communication between devices with different capabilities and enable \\emph{any} device with more than one carrier to act as a bridging device. It provides the foundation for uniform interaction between different nodes from different manufacturers with different capabilities. Through such a solution the so called "cloud" will be omnipresent. All devices shape one big cloud with localized communication.

	    
ewpage

		\\section{Transmission medium}
		    As previously mentioned there are many standards for data transmission between devices and each of them has its own API and caveats. The protocol discussed in this white paper is not meant to be a replacement for those but rather an additional layer which only requires the underlying medium to support at least one to one communication and optionally broadcast transmissions. It abstracts the foundation of interaction between devices away providing a stateless, decentralized network of arbitrary size in which devices can interact.
		    % TODO talk about medium access control (MAC) and add it to the routing
		    \\subsection{Ethernet}
		        % TODO Ethernet implementation
		    \\subsection{Bluetooth}
		        % TODO Bluetooth implementation

	    \\section{Data format}
    	    \\subsubsection{Serialization}
    	        All messages transmitted are assembled and disassembled using binary serialization in the form of scheme based Flatbuffers \\cite{flatbuffers}. Excluding the routing layer compression can be used if advertised in the message wrapper.

    	    \\subsubsection{Recursion}
    	        All \\glspl{datagram} are processed recursively. For example a MessageDatagram (\\ref{section:datagram:msg}) might contain a RouteDiscoveryDatagram (\\ref{section:routing:ierp}) so the intended recipient unwraps the MessageDatagram and processes the DiscoveryDatagram as if it was received directly.

        \\section{Node representation}
            Each participant in the network is represented by a \\acrlong{uuid} which is directly linked to a asymmetric key pair. In order for the \\acrshort{uuid} to be unique and representative it is provided by the alliance to hardware manufacturers and hobbyists in the form of address spaces. When a new manufacturer wants to use the protocol he requests an address space with the approximate amount of addresses he will likely utilize. The alliance then assigns the manufacturer a specific prefix which has a variable length depending on the volume of devices due to be produced and the manufacturer can then assign \\acrshort{uuid}s within this space at his own discretion. This ultimately makes the already very unlikely scenario of ID collisions even less probable.

	    \\section{Routing}\\label{ZRP}
	        With the foundation of a unified way of transmitting messages between devices regardless of the medium a network which previously consisted of a central gateway and clients enslaved to it became state- and shapeless. Nodes may come into range or connect and others may leave which poses a special challenge for routing messages between devices.\\\\
	        In order to cope with the dynamic architecture and possibly vast size of the network the \\acrlong{zrp} \\cite{zoneRoutingProtocol} is used. As opposed to proactive routing which is common in most networks \\acrshort{zrp} is a hybrid approach that utilizes both. The network is split in zones of a specific size where $s_{zone}$ is the amount of hops the local zone spans. Take into consideration that the zones are defined for every node. Each node has his own zone which overlaps with the zones of other nodes.\\\\
	        
ewpage
	        \\subsection[\\acrshort{iarp}]{\\acrlong{iarp}}
	            For all nodes within the local zone - reachable within $s_{zone}$ hops - proactive routing is used based on advertisements. Each devices advertises its presence to neighboring devices by broadcasting a \\gls{datagram} according to Listing \\ref{datagram:routing:iarp:advert} at a regular interval.
	            \\begin{listing}
	                \\begin{minted}{c++}
                        table AdvertisementDatagram {
                            // ***
                            // * Identification of a device
                            // * Consisting of the UUID and the public key of the advertiser.
                            // ***
                            uuid: UUID;
                            pubKey: PublicKey;

                            // ***
                            // * List of nodes this particular datagram passed through.
                            // * Utilized to build a routing table for the local zone.
                            // * Datagram is discarded if the list exceeds the zone size.
                            // ***
                            route: [UUID];

                            // ***
                            // * Signature
                            // * Created by calculating the SHA512 hashes of:
                            // * - uuid
                            // * - public key
                            // * and applying SHA512 on the concatenated hashes which then gets signed.
                            // ***
                            signature: [ubyte];

                            // ***
                            // * Advertising interval
                            // * Used to detect stale routes.
                            // ***
                            interval: uint;
                        }
	                \\end{minted}
	                \\caption{\\acrshort{iarp} advertisement}
	                \\label{datagram:routing:iarp:advert}
	            \\end{listing}
	            When a \\Gls{node} receives an advertisement it stores the path the \\gls{datagram} has taken (as stored in the route property) in a local routing table and thus knows a route to the advertising \\gls{node}. Since routes might go stale the datagram also contains the maximum interval at which the devices advertises. Is no advertisement received within this time period of the last one the route will be considered stale.\\\\
                In addition to storing the \\gls{datagram} locally it is broadcasted to all neighbors. If the underlying transmission medium permits it the origin of the advertisement is excluded from the broadcast. Upon broadcasting the \\gls{node} appends its \\acrshort{uuid} to the route property.

            \\subsection[\\acrshort{ierp}]{\\acrlong{ierp}}\\label{section:routing:ierp}
                In order to discover routes to nodes not within the same zone ($hopCount > s_{zone}$) the already existing routing tables of nodes outside the own zone can be utilized. In order to discover a route the source dispatches a specific \\gls{datagram} designed for this task as seen in Listing \\ref{datagram:routing:ierp:discov}. The \\gls{datagram} will be sent to all nodes that are exactly $s_{zone}$ hops away and thus on the border of the local zone. This process is known as \\Gls{bordercasting}.
	            \\begin{listing}
	                \\begin{minted}{c++}
                        table RouteDiscoveryDatagram {
                            // ***
                            // * Nodes the datagram has already covered.
                            // * Upon relaying all target nodes are added to this list prior to dispatch.
                            // * During dispatch these targets are skipped since they received it already.
                            // ***
                            coveredNodes: [UUID];

                            // ***
                            // * Identification of origin/destination
                            // * Used to determine where the datagram should go.
                            // ***
                            origin: PublicKey;
                            destination: UUID;

                            // ***
                            // * List of nodes traversed
                            // * Keeps track of the route to be used.
                            // ***
                            route: [UUID];

                            // ***
                            // * Unix timestamp
                            // * Used to calculate the travel time this route takes.
                            // * Utilized to determine a timeout value for this route.
                            // ***
                            sentTimestamp: long;
                        }
	                \\end{minted}
	                \\caption{\\acrshort{ierp} route discovery}
	                \\label{datagram:routing:ierp:discov}
	            \\end{listing}
	            To prevent loops the \\gls{datagram} contains all nodes it was dispatched to. During dispatch targets that are in this list are skipped and prior to dispatch all pending targets are added. Once a relaying node has the destination in its routing table it will be directly sent to it and further \\glspl{bordercasting} is stopped. Should the length of the route exceed a maximum value of $r_{max}$ then the datagram will be discarded and a DeliveryFailureDatagram (\\ref{datagram:routing:deliveryFailure}) is sent back along the route to the origin.

        \\section{Message transmission}\\label{section:datagram:msg}
            In order for \\acrshort{ierp} to work the RouteDiscoveryDatagram needs to be relayed via multiple nodes to the next border node according to the \\acrshort{iarp} routing table. This and further use of the discovered route require a special \\gls{datagram} type (refer Listing \\ref{datagram:routing:msg}) designed to deliver a payload along a previously discovered route to a destination.
            \\begin{listing}
                \\begin{minted}{c++}
                    table MessageDatagram {
                        // ***
                        // * List of nodes
                        // * Path this datagram should traverse.
                        // * Contains origin at the beginning and destination at the end.
                        // ***
                        route: [UUID];

                        // ***
                        // * Payload data
                        // * To be delivered to the destination.
                        // * Encrypted with the shared secret between the two involved parties.
                        // * Non-encrypted payloads get rejected.
                        // ***
                        payload: [ubyte];

                        // ***
                        // * Signature
                        // * SHA512 hash of the payload which then gets signed.
                        // ***
                        signature: [ubyte];
                    }
                \\end{minted}
                \\caption{Message delivery}
                \\label{datagram:routing:msg}
            \\end{listing}
            This \\gls{datagram} contains the route to take where each consecutive node it should traverse through is $s_{zone}$ from the previous and the traversal to the next border node is at the discretion of the relaying node and its routing table. The payload is encrypted with the shared secret of the two involved parties. Note that non-encrypted payloads are to be rejected. Additionally the message is signed with the private key of the sender as a proof of integrity and to prevent tampering along the route.

            \\subsection{Delivery failures}\\label{section:datagram:deliveryFailure}
                It might happen that delivery to a destination is not possible due to a stale route or an unresponsive target. In this case the node which notices discards the original \\gls{datagram} and transmits a DeliveryFailureDatagram as described in Listing \\ref{datagram:routing:deliveryFailure} back along its path encrypted for the original author of the \\gls{datagram} that couldn't be delivered.
                \\begin{listing}
                    \\begin{minted}{c++}
                        table DeliveryFailureDatagram {
                            // ***
                            // * List of nodes
                            // * Path this datagram should traverse.
                            // * Contains origin at the beginning and destination at the end.
                            // ***
                            route: [UUID];

                            // ***
                            // * ID of the target to which delivery failed
                            // ***
                            originalRecipient: UUID;
                        }
                    \\end{minted}
                    \\caption{Delivery failure}
                    \\label{datagram:routing:deliveryFailure}
                \\end{listing}
                Note that the failure of delivering such a \\gls{datagram} may not result in the dispatch of another DeliveryFailureDatagram.

        \\section{Communication workflow}
            In order for two parties to establish secured communication through a network of intermediate relays (if required) the following steps are required:
            \\begin{enumerate}
                \\item Origin checks whether or not the destination is within its zone. If that is the case bordercasting is skipped and the flow continues with \\ref{commflow:targetZone}
                \\item Origin bordercasts a RouteDiscoveryDatagram which propagates through the network according to section \\ref{section:routing:ierp} until either:
                    \\begin{enumerate}[label=(\\Alph*)]
                        \\item Its route exceeds the maximum route length and gets discarded along the way
                        \\item It reaches the target zone where it is directly forwarded to the destination \\label{commflow:targetZone}
                    \\end{enumerate}
                \\item Destination generates a shared secret from the public key inside the \\gls{datagram} and dispatches a symmetrically encrypted response along the route determined by the RouteDiscoveryDatagram. % TODO create special datagram for response
                \\item Once the origin receives it the route is stored and further encrypted communication may start.
            \\end{enumerate}

    \\chapter{Interaction}
        With the solid foundation built by the abstracted communication layer a unified and flexible way for \\glspl{device} to interact is necessary to preclude the emergence of proprietary ways for communication between devices which would result in a bulk of entities enclosed in their own environment only capable to talk to their siblings commonly known as IoT segregation.
        
ewpage
        \\section{How to communicate}
            In the following sections there are multiple datagrams described for \\glspl{device} to interact. Since this describes a new layer to the stack - the interaction layer - all the following \\glspl{datagram} are wrapped inside a MessageDatagram which contains the data necessary to be delivered to the other party where it is unpacked and processed. \\Glspl{device} (\\ref{section:interaction:device}) never directly interact with MessageDatagrams but rather pass their interaction-level datagrams together with their destination \\gls{device}'s \\acrshort{uuid} on to the communication layer which then wraps and dispatches it possibly discovering a route in the process.

        \\section{Devices}\\label{section:interaction:device}
            One \\gls{node} on the communication layer may represent a singular \\gls{device} on the interaction level and both share the same \\acrshort{uuid}.\\\\
            \\Glspl{node} are aware of each other through advertisements which enables routing but in order for interaction to take place it is required for a \\gls{node} to know the interface of a \\gls{device} in order to talk to it. To provide meta data of a \\gls{device} including its name and the available endpoints each \\gls{device} is required to have a special endpoint of the \\emph{Metadata} type at ID \\textbf{0}.

            \\subsection{Endpoints}\\label{section:interaction:device:endpoints}
                Each \\gls{device} has an interface through which other devices can interact with it. It is comprised of multiple endpoints which are defined in Listing \\ref{datagram:interaction:endpoint}.
                \\begin{listing}
                    \\begin{minted}{c++}
                        // ***
                        // * Magic numbers for endpoint types
                        // * Meaning is defined in online database.
                        // ***
                        enum EndpointTypeID : long {
                            Metadata = 0,
                            Color = 1,
                            Temperature = 2,
                            Brightness = 3,
                            Authorization = 4,
                            ...
                        }

                        table Endpoint {
                            // ***
                            // * Available functions
                            // * IDs of the functions from the type this endpoint supports
                            // ***
                            availableFunctions: [ubyte];

                            // ***
                            // * Type identifier
                            // * Uniquely identifies the endpoints type.
                            // * Implicitly defines the available functions.
                            // ***
                            type: EndpointTypeID;

                            // ***
                            // * Identification for the endpoint
                            // * Unique within the device.
                            // ***
                            identifier: uint;

                            // ***
                            // * Name of endpoint
                            // * Can be set through the special set_name(name: string) function.
                            // ***
                            name: string;
                        }
                    \\end{minted}
                    \\caption{Endpoint definition}
                    \\label{datagram:interaction:endpoint}
                \\end{listing}
                Every endpoint has a type which is defined through a magic number listed in the \\emph{EndpointTypeID} enum. Those numbers can be looked up in the online type database where each type identifier correlates to a specific interface.
                \\clearpage

                \\subsubsection[Endpoint types]{Endpoint type defintions}
                    The communication between nodes is type safe. That means every function has predefined arguments and return values. Every type has a unique identifier which can be used to reference it and a scalar data type to define the serialization. Additionally a human readable explanation on how to interpret the value is provided.
                    \\begin{minted}{c++}
                        brightness_t: float // 1.0 = full on, 0.0 = off
                        temperature_t: float // temperature in Kelvin
                        state_t: bool // true = on, false = off
                        RGB: {uint8, uint8, uint8} // r g b; 255 = full on, 0 = off
                        HSV: {uint8, uint8, uint8} // h s v; 255 = full on, 0 = off
                    \\end{minted}

                    \\begin{center}
                        \\begin{tabular}{|l|l|l|l|l|l|}
                        	\\hline
                        	\\multicolumn{2}{|c|}{\\textbf{Endpoint Type}} & \\multicolumn{2}{|c|}{\\textbf{Function}} & \\multirow{2}{*}{\\textbf{Parameters}} & \\multirow{2}{*}{\\textbf{Return Type}} \\\\
                        	ID & Name                                    & ID & Name                               &                                      &                                       \\\\ \\hline
                        	2  & Temperature                             & 0  & set\\_temperature                   & temperature\\_t                       & void                                  \\\\
                        	   &                                         & 1  & get\\_temperature                   &                                      & temperature\\_t                        \\\\ \\hline
                        	3  & Brightness                              & 0  & set\\_brightness                    & brightness\\_t                        & void                                  \\\\
                        	   &                                         & 1  & get\\_brightness                    &                                      & brightness\\_t                         \\\\ \\hline
                        \\end{tabular}
                    \\end{center}


                \\clearpage
                \\subsubsection[\\acrshort{rpc}]{\\acrlong{rpc}}\\label{section:interaction:device:endpoints:rpc}
                    In order to invoke a endpoint it is necessary to make a \\acrshort{rpc}. To start such a process the callee issues a function call as defined in Listing \\ref{datagram:interaction:functioncall}.
                    \\begin{listing}
                        \\begin{minted}{c++}
                            table FunctionCall {
                                // ***
                                // * Endpoint identifier
                                // * Unique to the device.
                                // ***
                                endpointID: ushort;

                                // ***
                                // * Function identifier
                                // * Unique to the endpoint.
                                // * Implicitly defines the parameter and return value serialization.
                                // ***
                                function: ubyte;

                                // ***
                                // * Transaction identifier
                                // * Used to correlate to the response.
                                // ***
                                transactionID: ubyte;

                                // ***
                                // * Serialized parameters
                                // ***
                                parameter: [ubyte];

                                // ***
                                // * Signature
                                // * Used to determine permission.
                                // ***
                                signature: Signature;
                            }
                        \\end{minted}
                        \\caption{Function call}
                        \\label{datagram:interaction:functioncall}
                    \\end{listing}
                    In case the function signature contains a byte stream the parameter property of the call only contains the non-stream entries. After the initial dispatch of the function call the device may then send consecutive StreamData (Listing \\ref{datagram:interaction:streamdata}) upon reception of a corresponding ok-response as defined in Listing \\ref{datagram:interaction:functioncallresponse} with the same transactionID.

                    \\begin{listing}
                        \\begin{minted}{c++}
                            table StreamData {
                                // ***
                                // * Transaction identifier
                                // * Used to correlate to the request.
                                // ***
                                transactionID: ubyte;

                                // ***
                                // * Payload
                                // * Contains the actual data.
                                // ***
                                payload: [ubyte];
                            }
                        \\end{minted}
                        \\caption{Streaming data}
                        \\label{datagram:interaction:streamdata}
                    \\end{listing}
                    The receiving device may only answer to StreamData in case the status code contains an error value. Unless the sender received a response with a non-ok error code it is assumed that the StreamData got transmitted successfully.\\\\
                    \\\\
                    Once the server received a function call it executes the function and dispatches a response with the same transaction ID as well as the status and the return value.
                    \\begin{listing}
                        \\begin{minted}{c++}
                            table FunctionCallResponse {
                                // ***
                                // * Transaction identifier
                                // * Used to correlate to the request.
                                // ***
                                transactionID: ubyte;

                                // ***
                                // * Status of the call
                                // * Used to determine whether or not the call succeeded.
                                // ***
                                statusCode: ubyte;

                                // ***
                                // * Serialized return value
                                // ***
                                returnValue: [ubyte];
                            }
                        \\end{minted}
                        \\caption{Function call response}
                        \\label{datagram:interaction:functioncallresponse}
                    \\end{listing}

                    % TODO Add reasonable and useful status codes
                    \\begin{center}
                        \\begin{tabular}{|c|c|l|}
                            \\multicolumn{2}{|c|}{Status Code} & \\multirow{2}{*}{Description} \\\\
                            Base 10 & Base 5 & \\\\\\hline
                            0 & 000 & Successd sajdf asdkfj aksld fjaks fksdl \\\\
                            25 & 100 & Success
                        \\end{tabular}
                    \\end{center}

        \\clearpage
        \\section{Users}\\label{section:interaction:user}
            Since a user may interact with devices it is required to represent a user entity within the network. This is done by generating a private key for the user based on random data. The user should then copy the key possibly through a file sharing endpoint between applications that allow the user to interact with the network and act as a proxy between the user and the network. Note that like devices users are participants in the network. They may have their own communication layer which uses their ID and public key. Unlike devices though users usually don't have endpoints.
            % TODO elaborate and evaluate if this is reasonable and expand on it

	\\clearpage
	\\printglossary[type=\\acronymtype]
    \\printglossary

    \\clearpage
    \\bibliographystyle{unsrt}
    \\bibliography{references}

\\end{document}`